import { afterEach, describe, expect, it, vi } from "vitest";
import { onBeforePrerenderStart } from "./+onBeforePrerenderStart";

function mockFetchOnce(body: unknown, ok = true) {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok,
      json: async () => body,
    })
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("blog/@id onBeforePrerenderStart", () => {
  it("builds both the logical and localized route for each post, de-duplicated across languages", async () => {
    mockFetchOnce([{ id: 1, title: "Post" }]);

    const routes = await onBeforePrerenderStart();

    expect(routes).toContain("/blog/1");
    expect(routes).toContain("/en/blog/1");
    expect(routes).toContain("/hu/blog/1");
    expect(routes).toContain("/de/blog/1");
    // /blog/1 should appear only once even though it's added for every language loop iteration.
    expect(routes.filter((r) => r === "/blog/1")).toHaveLength(1);
  });

  it("URL-encodes post ids that contain special characters", async () => {
    mockFetchOnce([{ id: "hello world", title: "Post" }]);
    const routes = await onBeforePrerenderStart();
    expect(routes).toContain("/blog/hello%20world");
  });

  // Note: getBlogPosts() always synthesizes a non-blank fallback id for a post
  // with a blank raw id, so the `if (!id) continue` guard here is defensive
  // code that the current service contract can never actually trigger.

  it("stays resilient (returns whatever it already collected) if the blog API fails for a language", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network down")));
    const routes = await onBeforePrerenderStart();
    expect(routes).toEqual([]);
  });
});
