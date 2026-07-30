import { afterEach, describe, expect, it, vi } from "vitest";
import { BlogApiError, getBlogPostDetail, getBlogPosts } from "./blogPostsService";

function mockFetchOnce(body: unknown, ok = true, status = ok ? 200 : 500) {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok,
      status,
      json: async () => body,
    })
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("getBlogPosts", () => {
  it("throws a BlogApiError carrying the response status when not ok", async () => {
    mockFetchOnce([], false, 503);
    await expect(getBlogPosts("hu")).rejects.toMatchObject({
      name: "BlogApiError",
      status: 503,
    });
    expect(BlogApiError.prototype).toBeInstanceOf(Error);
  });

  it("normalizes fields and synthesizes an id when the API doesn't provide one", async () => {
    mockFetchOnce([{ title: "  My Post  ", created_at: "2026-01-01", description: null }]);
    const [post] = await getBlogPosts("hu");
    expect(post.title).toBe("My Post");
    expect(post.id).toBe("My Post-2026-01-01-0");
    expect(post.description).toBe("");
  });

  it("uses the real id when present, coercing numbers to strings", async () => {
    mockFetchOnce([{ id: 42, title: "Post" }]);
    const [post] = await getBlogPosts("hu");
    expect(post.id).toBe("42");
  });
});

describe("getBlogPostDetail", () => {
  it("throws when the id is blank", async () => {
    await expect(getBlogPostDetail("  ", "hu")).rejects.toThrow("Blog post ID is required.");
  });

  it("URL-encodes the id in the request path", async () => {
    mockFetchOnce({ id: 1, title: "Post", sections: [] });
    await getBlogPostDetail("a b/c", "hu");

    const fetchMock = fetch as unknown as ReturnType<typeof vi.fn>;
    const [url] = fetchMock.mock.calls[0];
    expect(url).toContain(encodeURIComponent("a b/c"));
  });

  it("throws a BlogApiError with status when not ok", async () => {
    mockFetchOnce({}, false, 404);
    await expect(getBlogPostDetail("1", "hu")).rejects.toMatchObject({ status: 404 });
  });

  it("sorts sections by order and synthesizes section ids when missing", async () => {
    mockFetchOnce({
      id: 1,
      title: "Post",
      sections: [
        { subtitle: "Second", content: "b", order: 2 },
        { subtitle: "First", content: "a", order: 1 },
      ],
    });
    const detail = await getBlogPostDetail("1", "hu");
    expect(detail.sections.map((s) => s.subtitle)).toEqual(["First", "Second"]);
    // Synthesized ids are assigned by original array position (before sorting),
    // so "First" (originally at index 1) keeps id "...-section-2" after reordering.
    expect(detail.sections[0].id).toBe("1-section-2");
    expect(detail.sections[1].id).toBe("1-section-1");
  });

  it("falls back to the requested id when the response omits one", async () => {
    mockFetchOnce({ title: "Post", sections: [] });
    const detail = await getBlogPostDetail("fallback-id", "hu");
    expect(detail.id).toBe("fallback-id");
  });

  it("defaults section order to MAX_SAFE_INTEGER when not a finite number", async () => {
    mockFetchOnce({
      id: 1,
      sections: [{ subtitle: "No order", content: "x" }],
    });
    const detail = await getBlogPostDetail("1", "hu");
    expect(detail.sections[0].order).toBe(Number.MAX_SAFE_INTEGER);
  });
});
