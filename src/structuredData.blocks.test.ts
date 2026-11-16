import { describe, expect, it } from "vitest";
import {
  buildBlogPostingJsonLd,
  buildFaqJsonLd,
  buildServiceCatalogJsonLd,
  buildWebApplicationJsonLd,
} from "./structuredData";

describe("buildFaqJsonLd", () => {
  it("lists each question with its answer", () => {
    const faq = buildFaqJsonLd([{ q: "Mennyibe kerül?", a: "Ajánlat alapján." }]);

    expect(faq?.mainEntity).toEqual([
      {
        "@type": "Question",
        name: "Mennyibe kerül?",
        acceptedAnswer: { "@type": "Answer", text: "Ajánlat alapján." },
      },
    ]);
  });

  it("gives no block for a page without questions", () => {
    expect(buildFaqJsonLd([])).toBeNull();
    expect(buildFaqJsonLd([{ q: " ", a: "x" }])).toBeNull();
  });
});

describe("buildServiceCatalogJsonLd", () => {
  it("prices a service only when the price is known", () => {
    const catalog = buildServiceCatalogJsonLd({
      url: "https://synelweb.hu/hu/szolgaltatasok",
      name: "Szolgáltatások",
      services: [{ name: "Landing oldal", price: 150000, currency: "HUF" }, { name: "Egyedi" }],
    });

    expect(catalog?.itemListElement[0]).toMatchObject({ price: 150000, priceCurrency: "HUF" });
    expect(catalog?.itemListElement[1]).not.toHaveProperty("price");
  });

  it("gives no block when there is nothing to list", () => {
    expect(
      buildServiceCatalogJsonLd({ url: "https://synelweb.hu/x", name: "x", services: [] })
    ).toBeNull();
  });
});

describe("buildWebApplicationJsonLd", () => {
  it("describes the checker as a free web app", () => {
    const app = buildWebApplicationJsonLd({
      url: "https://synelweb.hu/hu/weboldal-ellenorzes",
      name: "Weboldal-ellenőrzés",
      description: "Mérés",
      lang: "hu",
    });

    expect(app).toMatchObject({ "@type": "WebApplication", isAccessibleForFree: true });
    expect(app.offers.price).toBe(0);
  });
});

describe("buildBlogPostingJsonLd", () => {
  const base = {
    url: "https://synelweb.hu/hu/blog/cikk",
    title: "Cikk",
    description: "Leírás",
    image: "",
    datePublished: "2026-08-04T13:07:30Z",
  };

  it("names a person as the author and carries the modification date", () => {
    const post = buildBlogPostingJsonLd({
      ...base,
      dateModified: "2026-08-05T10:00:00Z",
      authorUrl: "https://synelweb.hu/hu/rolam",
    });

    expect(post.author).toEqual({
      "@type": "Person",
      name: "Németh Szilveszter",
      url: "https://synelweb.hu/hu/rolam",
    });
    expect(post.dateModified).toBe("2026-08-05T10:00:00Z");
  });

  it("leaves out a modification date that isn't a date", () => {
    expect(buildBlogPostingJsonLd({ ...base, dateModified: "nincs" })).not.toHaveProperty(
      "dateModified"
    );
  });
});
