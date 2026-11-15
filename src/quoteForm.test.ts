import { describe, expect, it } from "vitest";
import { QUOTE_FORM_ANCHOR, quoteFormHref } from "./quoteForm";

describe("quoteFormHref", () => {
  it("points at the form on the localized contact page", () => {
    expect(quoteFormHref("hu")).toBe(`/hu/kapcsolat#${QUOTE_FORM_ANCHOR}`);
    expect(quoteFormHref("de")).toBe(`/de/kontakt#${QUOTE_FORM_ANCHOR}`);
  });

  it("can preselect a service", () => {
    expect(quoteFormHref("en", "seo & ads")).toBe(
      `/en/contact?service=seo%20%26%20ads#${QUOTE_FORM_ANCHOR}`
    );
  });

  it("can pass a checked website along", () => {
    expect(quoteFormHref("hu", undefined, { site: "https://pelda.hu/a b" })).toBe(
      `/hu/kapcsolat?site=https%3A%2F%2Fpelda.hu%2Fa%20b#${QUOTE_FORM_ANCHOR}`
    );
  });
});
