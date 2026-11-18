import { describe, expect, it } from "vitest";
import { buildMeta, getSeoEntry, toMetaDescription, toPostTitle } from "./seo";

describe("getSeoEntry", () => {
  it("returns the localized title/description for a known path", () => {
    expect(getSeoEntry("/about", "hu")).toEqual({
      title: "Rólam – webfejlesztő Sopronból | SynelWeb",
      description:
        "Németh Szilveszter vagyok, soproni webfejlesztő: egyedi weboldalakat, technikai SEO-t és gyors, biztonságos megoldásokat készítek vállalkozásoknak.",
    });
  });

  it("normalizes trailing slashes before lookup", () => {
    expect(getSeoEntry("/about/", "en")).toEqual(getSeoEntry("/about", "en"));
  });

  it("falls back to the brand name with an empty description for unknown paths", () => {
    expect(getSeoEntry("/adatkezeles", "hu")).toEqual({ title: "SynelWeb", description: "" });
  });
});

describe("buildMeta", () => {
  it("builds a canonical URL using the localized path", () => {
    const meta = buildMeta({ pathname: "/about", lang: "hu" });
    expect(meta.canonicalUrl).toBe("https://synelweb.hu/hu/rolam");
  });

  it("uses page-provided title/description over the SEO table when given", () => {
    const meta = buildMeta({
      pathname: "/about",
      lang: "en",
      title: "Custom Title",
      description: "Custom description",
    });
    expect(meta.title).toBe("Custom Title");
    expect(meta.description).toBe("Custom description");
  });

  it("falls back to the SEO table when title/description are blank", () => {
    const meta = buildMeta({ pathname: "/about", lang: "en", title: "  ", description: "" });
    expect(meta.title).toBe("About – Web Developer from Sopron, Hungary | SynelWeb");
    expect(meta.description).toContain("Meet Szilveszter Németh");
  });

  it("defaults the image to the site share image when none is given", () => {
    const meta = buildMeta({ pathname: "/", lang: "hu" });
    expect(meta.image).toBe("https://synelweb.hu/og-image.png");
  });

  it("uses a provided image when non-empty", () => {
    const meta = buildMeta({ pathname: "/", lang: "hu", image: "https://example.com/x.png" });
    expect(meta.image).toBe("https://example.com/x.png");
  });

  it("builds hreflang alternates for every supported language plus x-default", () => {
    const meta = buildMeta({ pathname: "/contact", lang: "de" });
    const hreflangs = meta.alternates.map((entry) => entry.hreflang);
    expect(hreflangs).toEqual(["en", "hu", "de", "x-default"]);

    const enAlternate = meta.alternates.find((entry) => entry.hreflang === "en");
    expect(enAlternate?.href).toBe("https://synelweb.hu/en/contact");

    const xDefault = meta.alternates.find((entry) => entry.hreflang === "x-default");
    expect(xDefault?.href).toBe("https://synelweb.hu/hu/kapcsolat");
  });
});

describe("buildMeta for single-language pages", () => {
  const base = { title: null, description: null, image: null };

  it("keeps legal pages at their unprefixed address", () => {
    const meta = buildMeta({ ...base, pathname: "/impresszum", lang: "hu" });

    expect(meta.canonicalUrl).toBe("https://synelweb.hu/impresszum");
    expect(meta.alternates).toEqual([{ hreflang: "hu", href: "https://synelweb.hu/impresszum" }]);
  });

  it("points an untranslated blog post at the Hungarian original", () => {
    const meta = buildMeta({ ...base, pathname: "/blog/4", lang: "en", postLangs: ["hu"] });

    expect(meta.canonicalUrl).toBe("https://synelweb.hu/hu/blog/4");
    expect(meta.alternates).toEqual([{ hreflang: "hu", href: "https://synelweb.hu/hu/blog/4" }]);
  });

  it("gives a translated blog post its own address and lists its languages", () => {
    const meta = buildMeta({ ...base, pathname: "/blog/4", lang: "en", postLangs: ["hu", "en"] });

    expect(meta.canonicalUrl).toBe("https://synelweb.hu/en/blog/4");
    expect(meta.alternates).toEqual([
      { hreflang: "en", href: "https://synelweb.hu/en/blog/4" },
      { hreflang: "hu", href: "https://synelweb.hu/hu/blog/4" },
      { hreflang: "x-default", href: "https://synelweb.hu/hu/blog/4" },
    ]);
    // German has no translation: that page still points at the Hungarian one.
    expect(
      buildMeta({ ...base, pathname: "/blog/4", lang: "de", postLangs: ["hu", "en"] }).canonicalUrl
    ).toBe("https://synelweb.hu/hu/blog/4");
  });

  it("still lists every language for the blog index", () => {
    const meta = buildMeta({ ...base, pathname: "/blog", lang: "de" });

    expect(meta.canonicalUrl).toBe("https://synelweb.hu/de/blog");
    expect(meta.alternates.map((a) => a.hreflang)).toEqual(["en", "hu", "de", "x-default"]);
  });
});

describe("toMetaDescription", () => {
  it("leaves a short description alone", () => {
    expect(toMetaDescription("  Rövid   leírás.  ")).toBe("Rövid leírás.");
  });

  it("cuts a long one at a word boundary and marks the cut", () => {
    const long = "szó ".repeat(80).trim();
    const result = toMetaDescription(long);

    expect(result.length).toBeLessThanOrEqual(155);
    expect(result.endsWith("szó…")).toBe(true);
  });
});

describe("toPostTitle", () => {
  it("adds the brand when the result still fits a search result", () => {
    expect(toPostTitle("Rövid cím")).toBe("Rövid cím | SynelWeb");
  });

  it("keeps a long title bare instead of having the brand cut off", () => {
    const long = "Miért kerül ennyibe? A funkciók, amik észrevétlenül megdobják az árat";
    expect(toPostTitle(long)).toBe(long);
  });
});

describe("share images", () => {
  const base = { title: null, description: null, image: null };

  it("gives the site check and Google Ads pages their own image per language", () => {
    expect(buildMeta({ ...base, pathname: "/site-check", lang: "de" }).image).toBe(
      "https://synelweb.hu/og/site-check-de.jpg"
    );
    expect(buildMeta({ ...base, pathname: "/google-ads", lang: "hu" }).image).toBe(
      "https://synelweb.hu/og/google-ads-hu.jpg"
    );
  });

  it("uses the brand image elsewhere, and a post's own image for a post", () => {
    expect(buildMeta({ ...base, pathname: "/about", lang: "hu" }).image).toBe(
      "https://synelweb.hu/og-image.png"
    );
    expect(
      buildMeta({ ...base, pathname: "/blog/x", lang: "hu", image: "https://img/x.jpg" }).image
    ).toBe("https://img/x.jpg");
  });
});

describe("meta description length", () => {
  it("keeps every page description long enough to describe the page", () => {
    for (const lang of ["hu", "en", "de"] as const) {
      for (const path of [
        "/",
        "/about",
        "/services",
        "/projects",
        "/blog",
        "/technology",
        "/contact",
      ]) {
        expect(getSeoEntry(path, lang).description.length).toBeGreaterThanOrEqual(120);
      }
    }
  });
});
