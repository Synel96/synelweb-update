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
