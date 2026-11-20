import { describe, expect, it } from "vitest";
import { getTestI18n } from "@/test/i18n-test-instance";
import { describeAuditItem, sortAuditItems } from "./siteCheckAudit";
import type { AuditItem } from "@/src/services/siteCheckService";

describe("site check audit texts", () => {
  it("fills in the numbers and lists the found types", async () => {
    const t = (await getTestI18n("hu")).getFixedT("hu");
    const item: AuditItem = {
      id: "structuredData",
      status: "pass",
      data: { types: ["LocalBusiness", "WebSite"], invalid: 0, hasBusiness: true },
    };

    expect(describeAuditItem("seo", item, t, "hu")).toEqual({
      label: "Strukturált adatok",
      message: "Megvan: LocalBusiness, WebSite.",
    });
    expect(
      describeAuditItem(
        "tech",
        { id: "pageWeight", status: "fail", data: { kb: 3400, requests: 120 } },
        t,
        "hu"
      )?.message
    ).toBe("3400 kB, 120 kérés – túl nehéz, mobilon lassan tölt be.");
  });

  it("uses the warning text for a failure without its own text", async () => {
    const t = (await getTestI18n("en")).getFixedT("en");
    const text = describeAuditItem(
      "tech",
      { id: "codeSplitting", status: "fail", data: { largestKb: 900 } },
      t,
      "en"
    );
    expect(text?.message).toMatch(/^The largest script is 900 kB: the code loads in one piece/);
  });

  it("skips an item it has no text for and puts problems first", async () => {
    const t = (await getTestI18n("de")).getFixedT("de");
    expect(
      describeAuditItem("seo", { id: "future", status: "warn", data: {} }, t, "de")
    ).toBeNull();

    const sorted = sortAuditItems([
      { id: "a", status: "pass", data: {} },
      { id: "b", status: "warn", data: {} },
      { id: "c", status: "fail", data: {} },
    ]);
    expect(sorted.map((item) => item.id)).toEqual(["c", "b", "a"]);
  });
});

describe("platform line", () => {
  it("names a custom build's framework and admits when it can't tell", async () => {
    const { describePlatform } = await import("./siteCheckAudit");
    const t = (await getTestI18n("hu")).getFixedT("hu");
    const base = { builder: null, addons: [], theme: null };

    expect(describePlatform({ ...base, frameworks: ["Next.js"], kind: "custom" }, t).headline).toBe(
      "Valószínűleg egyedi fejlesztés: Next.js."
    );
    expect(describePlatform({ ...base, frameworks: [], kind: "unknown" }, t)).toEqual({
      headline:
        "Nem ismerhető fel – valószínűleg egyedi fejlesztés, vagy elrejtett nyomokkal készült.",
      note: "",
    });
  });
});

describe("video and llms.txt texts", () => {
  it("names the video formats and tells no video from a scripted one", async () => {
    const t = (await getTestI18n("hu")).getFixedT("hu");
    const warn = describeAuditItem(
      "seo",
      { id: "video", status: "warn", data: { count: 1, formats: ["mp4"], scripted: 0 } },
      t,
      "hu"
    );
    expect(warn?.message).toMatch(/^Csak MP4: WebM/);
    const auto = describeAuditItem(
      "seo",
      { id: "video", status: "pass", data: { count: 1, formats: ["auto"], scripted: 0 } },
      t,
      "hu"
    );
    expect(auto?.message).toBe("Korszerű formátum: automatikus (a böngészőhöz igazított).");
    expect(
      describeAuditItem(
        "seo",
        { id: "video", status: "info", data: { count: 0, formats: [] } },
        t,
        "hu"
      )?.message
    ).toBe("Nincs videó az oldalon.");
    expect(
      describeAuditItem("seo", { id: "llmsTxt", status: "info", data: {} }, t, "hu")?.message
    ).toMatch(/^Nincs llms.txt/);
  });
});

describe("privacy texts", () => {
  it("explains tracking, consent and the legal pages", async () => {
    const t = (await getTestI18n("hu")).getFixedT("hu");
    const say = (item: AuditItem) => describeAuditItem("privacy", item, t, "hu")?.message;

    expect(
      say({
        id: "trackers",
        status: "info",
        data: { tracking: ["Google Analytics", "Meta Pixel"], cookieless: [] },
      })
    ).toBe("Sütit használó szolgáltatások: Google Analytics, Meta Pixel.");
    expect(say({ id: "trackers", status: "info", data: { tracking: [], cookieless: [] } })).toBe(
      "Nem találtam követőkódot az oldalon."
    );
    expect(say({ id: "consent", status: "fail", data: { tracking: 2, tools: [] } })).toMatch(
      /^2 sütit használó szolgáltatás fut, de nem találtam sütibannert/
    );
    expect(
      say({ id: "consent", status: "pass", data: { tracking: 1, tools: ["Cookiebot"] } })
    ).toBe("Van hozzájárulás-kezelő: Cookiebot.");
    expect(say({ id: "consent", status: "pass", data: { tracking: 0, tools: [] } })).toMatch(
      /^Nincs sütit használó/
    );
    expect(say({ id: "privacyPolicy", status: "fail", data: {} })).toMatch(
      /^Nem találtam adatkezelési/
    );
    // Tracking with a privacy notice but no separate cookie notice.
    expect(
      say({ id: "cookiePolicy", status: "info", data: { tracking: 3, inPrivacy: true } })
    ).toMatch(/^Nincs külön süti tájékoztató\. Ez rendben van/);
    expect(say({ id: "cookiePolicy", status: "info", data: {} })).toMatch(/nem is kell\.$/);
  });
});
