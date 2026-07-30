import { describe, expect, it } from "vitest";
import title from "./+title";

describe("title pageContext hook", () => {
  it("returns the SEO title for a known logical path", () => {
    expect(title({ urlPathname: "/about", lang: "hu" })).toBe("Rólam | SynelWeb");
  });

  it("defaults to the default language when unset", () => {
    expect(title({ urlPathname: "/about" })).toBe("Rólam | SynelWeb");
  });

  it("prefers the blog post title over the SEO table when present", () => {
    expect(
      title({
        urlPathname: "/blog/some-post",
        lang: "en",
        data: { post: { title: "  My Post  " } },
      })
    ).toBe("My Post");
  });

  it("falls back to the SEO table when there is no post title", () => {
    expect(title({ urlPathname: "/blog/some-post", lang: "en", data: { post: null } })).toBe(
      "SynelWeb"
    );
  });

  it("falls back to the SEO table when the post title is blank", () => {
    expect(
      title({ urlPathname: "/blog/some-post", lang: "en", data: { post: { title: "   " } } })
    ).toBe("SynelWeb");
  });
});
