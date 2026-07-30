import { afterEach, describe, expect, it, vi } from "vitest";

const { getBlogPostDetail, getBlogPosts, BlogApiError } = vi.hoisted(() => {
  class BlogApiError extends Error {
    status: number;
    constructor(message: string, status: number) {
      super(message);
      this.name = "BlogApiError";
      this.status = status;
    }
  }
  return {
    getBlogPostDetail: vi.fn(),
    getBlogPosts: vi.fn(),
    BlogApiError,
  };
});
vi.mock("@/src/services/blogPostsService", () => ({
  getBlogPostDetail,
  getBlogPosts,
  BlogApiError,
}));

import { data } from "./+data";

const postDetail = {
  id: "2",
  title: "Second",
  description: "",
  previewImageUrl: "",
  category: "professional",
  createdAt: "2026-01-02",
  sections: [],
};

const postList = [
  { id: "3", title: "Third", description: "Third summary" },
  { id: "2", title: "Second", description: "Second summary" },
  { id: "1", title: "First", description: "First summary" },
];

afterEach(() => {
  vi.clearAllMocks();
});

describe("blog/@id +data", () => {
  it("returns notFound without calling any service when the id param is blank", async () => {
    const result = await data({ routeParams: { id: "  " } });
    expect(result).toEqual({
      post: null,
      previousPost: null,
      nextPost: null,
      fetchError: false,
      notFound: true,
    });
    expect(getBlogPostDetail).not.toHaveBeenCalled();
  });

  it("resolves the previous (older) and next (newer) posts from the list", async () => {
    getBlogPostDetail.mockResolvedValue(postDetail);
    getBlogPosts.mockResolvedValue(postList);

    const result = await data({ lang: "en", routeParams: { id: "2" } });

    expect(getBlogPostDetail).toHaveBeenCalledWith("2", "en");
    expect(result.notFound).toBe(false);
    expect(result.fetchError).toBe(false);
    expect(result.previousPost).toEqual({ id: "1", title: "First" });
    expect(result.nextPost).toEqual({ id: "3", title: "Third" });
  });

  it("has no previous post for the oldest (last) entry in the list", async () => {
    getBlogPostDetail.mockResolvedValue({ ...postDetail, id: "1", title: "First" });
    getBlogPosts.mockResolvedValue(postList);

    const result = await data({ lang: "en", routeParams: { id: "1" } });
    expect(result.previousPost).toBeNull();
    expect(result.nextPost).toEqual({ id: "2", title: "Second" });
  });

  it("has no next post for the newest (first) entry in the list", async () => {
    getBlogPostDetail.mockResolvedValue({ ...postDetail, id: "3", title: "Third" });
    getBlogPosts.mockResolvedValue(postList);

    const result = await data({ lang: "en", routeParams: { id: "3" } });
    expect(result.previousPost).toEqual({ id: "2", title: "Second" });
    expect(result.nextPost).toBeNull();
  });

  it("falls back to the list entry's description when the detail response has none", async () => {
    getBlogPostDetail.mockResolvedValue(postDetail);
    getBlogPosts.mockResolvedValue(postList);

    const result = await data({ lang: "en", routeParams: { id: "2" } });
    expect(result.post?.description).toBe("Second summary");
  });

  it("has no prev/next and no description fallback when the post isn't found in the list", async () => {
    getBlogPostDetail.mockResolvedValue(postDetail);
    getBlogPosts.mockResolvedValue([]);

    const result = await data({ lang: "en", routeParams: { id: "2" } });
    expect(result.previousPost).toBeNull();
    expect(result.nextPost).toBeNull();
    expect(result.post?.description).toBe("");
  });

  it("still succeeds if the secondary posts-list fetch fails (no prev/next)", async () => {
    getBlogPostDetail.mockResolvedValue(postDetail);
    getBlogPosts.mockRejectedValue(new Error("list endpoint down"));

    const result = await data({ lang: "en", routeParams: { id: "2" } });
    expect(result.fetchError).toBe(false);
    expect(result.post).not.toBeNull();
    expect(result.previousPost).toBeNull();
  });

  it("maps a 404 BlogApiError to notFound instead of fetchError", async () => {
    getBlogPostDetail.mockRejectedValue(new BlogApiError("not found", 404));
    getBlogPosts.mockResolvedValue([]);

    const result = await data({ lang: "en", routeParams: { id: "missing" } });
    expect(result.notFound).toBe(true);
    expect(result.fetchError).toBe(false);
    expect(result.post).toBeNull();
  });

  it("maps a non-404 failure to fetchError instead of notFound", async () => {
    getBlogPostDetail.mockRejectedValue(new Error("network down"));
    getBlogPosts.mockResolvedValue([]);

    const result = await data({ lang: "en", routeParams: { id: "2" } });
    expect(result.notFound).toBe(false);
    expect(result.fetchError).toBe(true);
  });

  it("maps a non-404 BlogApiError to fetchError", async () => {
    getBlogPostDetail.mockRejectedValue(new BlogApiError("server error", 500));
    getBlogPosts.mockResolvedValue([]);

    const result = await data({ lang: "en", routeParams: { id: "2" } });
    expect(result.notFound).toBe(false);
    expect(result.fetchError).toBe(true);
  });

  it("defaults to the default language when pageContext.lang is unset", async () => {
    getBlogPostDetail.mockResolvedValue(postDetail);
    getBlogPosts.mockResolvedValue([]);

    await data({ routeParams: { id: "2" } });
    expect(getBlogPostDetail).toHaveBeenCalledWith("2", "hu");
  });
});
