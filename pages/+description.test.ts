import { describe, expect, it } from "vitest";
import description from "./+description";

describe("description pageContext hook", () => {
  it("returns the SEO description for a known logical path", () => {
    expect(description({ urlPathname: "/contact", lang: "en" })).toContain("Contact SynelWeb");
  });

  it("defaults to the default language when unset", () => {
    expect(description({ urlPathname: "/contact" })).toContain("Lépj kapcsolatba");
  });

  it("prefers the blog post description over the SEO table when present", () => {
    expect(
      description({
        urlPathname: "/blog/some-post",
        lang: "en",
        data: { post: { description: "  Custom summary  " } },
      })
    ).toBe("Custom summary");
  });

  it("falls back to the SEO table when there is no post description", () => {
    expect(description({ urlPathname: "/blog/some-post", lang: "en", data: { post: null } })).toBe(
      ""
    );
  });
});
