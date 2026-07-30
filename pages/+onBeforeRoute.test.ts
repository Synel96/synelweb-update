import { describe, expect, it } from "vitest";
import { onBeforeRoute } from "./+onBeforeRoute";

describe("onBeforeRoute", () => {
  it("strips a recognized language prefix and exposes the logical path", () => {
    const result = onBeforeRoute({ urlOriginal: "/en/about" });
    expect(result.pageContext.lang).toBe("en");
    expect(result.pageContext.urlLogical).toBe("/about");
  });

  it("resolves a localized segment back to its logical path", () => {
    const result = onBeforeRoute({ urlOriginal: "/hu/szolgaltatasok" });
    expect(result.pageContext.lang).toBe("hu");
    expect(result.pageContext.urlLogical).toBe("/services");
  });

  it("preserves the query string and hash on the logical URL", () => {
    const result = onBeforeRoute({ urlOriginal: "/en/contact?ref=footer#map" });
    expect(result.pageContext.urlLogical).toBe("/contact?ref=footer#map");
  });

  it("defaults to the default language when there is no recognized prefix", () => {
    const result = onBeforeRoute({ urlOriginal: "/adatkezeles" });
    expect(result.pageContext.lang).toBe("hu");
    expect(result.pageContext.urlLogical).toBe("/adatkezeles");
  });
});
