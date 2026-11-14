import { describe, expect, it } from "vitest";
import { BRAND_NAME, NAV_LINKS, SITE_URL, visibleSubLinks } from "./site";

describe("site constants", () => {
  it("exposes the brand name and site URL from env", () => {
    expect(BRAND_NAME).toBe("SynelWeb");
    expect(SITE_URL).toBe("https://synelweb.hu");
  });
});

describe("NAV_LINKS", () => {
  it("contains an entry for every primary section", () => {
    const hrefs = NAV_LINKS.map((link) => link.href);
    expect(hrefs).toEqual([
      "/",
      "/services",
      "/projects",
      "/certificates",
      "/blog",
      "/technology",
      "/contact",
      "/about",
    ]);
  });

  it("hides the blog link for en/de but not hu", () => {
    const blogLink = NAV_LINKS.find((link) => link.href === "/blog");
    expect(blogLink?.hiddenInLangs).toEqual(["en", "de"]);
  });

  it("keeps the certificates link out of the desktop row only", () => {
    const certificates = NAV_LINKS.find((link) => link.href === "/certificates");
    expect(certificates?.hiddenInDesktopNav).toBe(true);
    expect(NAV_LINKS.filter((link) => link.hiddenInDesktopNav)).toHaveLength(1);
  });

  it("does not hide non-blog links in any language", () => {
    const nonBlogLinks = NAV_LINKS.filter((link) => link.href !== "/blog");
    for (const link of nonBlogLinks) {
      expect(link.hiddenInLangs).toBeUndefined();
    }
  });
});

describe("visibleSubLinks", () => {
  const services = NAV_LINKS.find((link) => link.href === "/services")!;

  it("keeps the regional pages out of the header menu", () => {
    for (const lang of ["hu", "en", "de"] as const) {
      expect(visibleSubLinks(services, lang).map((link) => link.href)).toEqual([
        "/services",
        "/google-ads",
      ]);
    }
  });

  it("lists each language's regional page for the footer", () => {
    expect(
      visibleSubLinks(services, "hu", { includeFooterOnly: true }).map((link) => link.href)
    ).toEqual(["/services", "/google-ads", "/sopron"]);
    expect(
      visibleSubLinks(services, "de", { includeFooterOnly: true }).map((link) => link.href)
    ).toEqual(["/services", "/google-ads", "/austria"]);
    expect(
      visibleSubLinks(services, "en", { includeFooterOnly: true }).map((link) => link.href)
    ).toEqual(["/services", "/google-ads"]);
  });
});
