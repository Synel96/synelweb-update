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
});
