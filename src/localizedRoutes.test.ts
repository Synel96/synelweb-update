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
      "/projects",
      "/blog",
      "/technology",
      "/contact",
    ]);
  });
});
