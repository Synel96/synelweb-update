import { describe, expect, it } from "vitest";
import { BRAND_NAME, NAV_LINKS, SITE_URL } from "./site";

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

  it("does not hide non-blog links in any language", () => {
    const nonBlogLinks = NAV_LINKS.filter((link) => link.href !== "/blog");
    for (const link of nonBlogLinks) {
      expect(link.hiddenInLangs).toBeUndefined();
    }
  });
});
