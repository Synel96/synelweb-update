import { describe, expect, it } from "vitest";
import {
  KNOWN_LOGICAL_PATHS,
  localizePath,
  normalizeLogicalPath,
  resolveCurrentLang,
  resolveLanguageAndLogicalPath,
  toLogicalPath,
} from "./localizedRoutes";

describe("normalizeLogicalPath", () => {
  it("returns / for empty or root paths", () => {
    expect(normalizeLogicalPath("")).toBe("/");
    expect(normalizeLogicalPath("/")).toBe("/");
  });

  it("strips trailing slashes and query/hash fragments", () => {
    expect(normalizeLogicalPath("/about/")).toBe("/about");
    expect(normalizeLogicalPath("/about?x=1")).toBe("/about");
    expect(normalizeLogicalPath("/about#section")).toBe("/about");
  });

  it("adds a leading slash if missing", () => {
    expect(normalizeLogicalPath("about")).toBe("/about");
  });
});

describe("localizePath", () => {
  it("maps the root path to the bare language prefix", () => {
    expect(localizePath("/", "en")).toBe("/en/");
    expect(localizePath("/", "hu")).toBe("/hu/");
  });

  it("uses the localized segment for known logical paths", () => {
    expect(localizePath("/about", "hu")).toBe("/hu/rolam");
    expect(localizePath("/about", "de")).toBe("/de/ueber-mich");
    expect(localizePath("/services", "en")).toBe("/en/services");
    expect(localizePath("/contact", "de")).toBe("/de/kontakt");
  });

  it("falls back to prefixing unknown paths as-is", () => {
    expect(localizePath("/adatkezeles", "en")).toBe("/en/adatkezeles");
  });

  it("normalizes an already-prefixed path instead of double-prefixing", () => {
    expect(localizePath("/en/contact", "hu")).toBe("/hu/kapcsolat");
  });
});

describe("toLogicalPath", () => {
  it("maps a localized segment back to its logical path", () => {
    expect(toLogicalPath("/rolam", "hu")).toBe("/about");
    expect(toLogicalPath("/ueber-mich", "de")).toBe("/about");
    expect(toLogicalPath("/kapcsolat", "hu")).toBe("/contact");
  });

  it("returns the normalized path unchanged when no mapping exists", () => {
    expect(toLogicalPath("/adatkezeles", "hu")).toBe("/adatkezeles");
  });

  it("treats the root path as /", () => {
    expect(toLogicalPath("/", "en")).toBe("/");
  });
});

describe("resolveLanguageAndLogicalPath", () => {
  it("extracts a supported language prefix and strips it", () => {
    expect(resolveLanguageAndLogicalPath("/en/about")).toEqual({
      lang: "en",
      logicalPath: "/about",
      hasLangPrefix: true,
    });
  });

  it("resolves the localized segment back to its logical path under a prefix", () => {
    expect(resolveLanguageAndLogicalPath("/hu/szolgaltatasok")).toEqual({
      lang: "hu",
      logicalPath: "/services",
      hasLangPrefix: true,
    });
  });

  it("treats a bare language prefix as the root", () => {
    expect(resolveLanguageAndLogicalPath("/de/")).toEqual({
      lang: "de",
      logicalPath: "/",
      hasLangPrefix: true,
    });
  });

  it("falls back to the default language when there is no recognized prefix", () => {
    expect(resolveLanguageAndLogicalPath("/unknown")).toEqual({
      lang: "hu",
      logicalPath: "/unknown",
      hasLangPrefix: false,
    });
  });

  it("falls back to the default language for the bare root", () => {
    expect(resolveLanguageAndLogicalPath("/")).toEqual({
      lang: "hu",
      logicalPath: "/",
      hasLangPrefix: false,
    });
  });
});

describe("resolveCurrentLang", () => {
  it("returns the given lang when it is supported", () => {
    expect(resolveCurrentLang("de")).toBe("de");
  });

  it("falls back to the default when given an unsupported/undefined lang and no window", () => {
    expect(resolveCurrentLang(undefined)).toBe("hu");
  });
});

describe("KNOWN_LOGICAL_PATHS", () => {
  it("contains the expected set of routes", () => {
    expect(KNOWN_LOGICAL_PATHS).toEqual([
      "/",
      "/about",
      "/services",
      "/google-ads",
      "/projects",
      "/certificates",
      "/blog",
      "/technology",
      "/contact",
    ]);
  });
});

describe("certificates route", () => {
  it("is localized in every language and resolves back", () => {
    expect(localizePath("/certificates", "hu")).toBe("/hu/tanusitvanyok");
    expect(localizePath("/certificates", "en")).toBe("/en/certificates");
    expect(localizePath("/certificates", "de")).toBe("/de/zertifikate");
    expect(resolveLanguageAndLogicalPath("/de/zertifikate").logicalPath).toBe("/certificates");
  });
});

describe("regional landing pages", () => {
  it("live under their own slug in their one language", () => {
    expect(localizePath("/sopron", "hu")).toBe("/hu/weboldal-keszites-sopron");
    expect(localizePath("/austria", "de")).toBe("/de/webdesign-burgenland-wien");
    expect(resolveLanguageAndLogicalPath("/hu/weboldal-keszites-sopron").logicalPath).toBe(
      "/sopron"
    );
    expect(resolveLanguageAndLogicalPath("/de/webdesign-burgenland-wien").logicalPath).toBe(
      "/austria"
    );
  });

  it("fall back to the services page in the other languages", () => {
    expect(localizePath("/sopron", "en")).toBe("/en/services");
    expect(localizePath("/sopron", "de")).toBe("/de/dienstleistungen");
    expect(localizePath("/austria", "hu")).toBe("/hu/szolgaltatasok");
  });

  it("are not served in the wrong language", () => {
    expect(resolveLanguageAndLogicalPath("/en/sopron").logicalPath).toBe("/__unavailable");
    expect(resolveLanguageAndLogicalPath("/hu/webdesign-burgenland-wien").logicalPath).not.toBe(
      "/austria"
    );
  });
});
