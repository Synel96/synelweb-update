import { describe, expect, it } from "vitest";
import { buildMeta, getSeoEntry } from "./seo";

describe("getSeoEntry", () => {
  it("returns the localized title/description for a known path", () => {
    expect(getSeoEntry("/about", "hu")).toEqual({
      title: "Rólam | SynelWeb",
      description:
        "Ismerd meg, hogyan dolgozom: egyedi webfejlesztés, technikai SEO, gyors és biztonságos megoldások helyi vállalkozásoknak.",
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
    expect(meta.title).toBe("About | SynelWeb");
    expect(meta.description).toContain("Learn how I work");
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
