import { afterEach, describe, expect, it, vi } from "vitest";

const { getBlogPosts } = vi.hoisted(() => ({ getBlogPosts: vi.fn() }));
vi.mock("@/src/services/blogPostsService", () => ({ getBlogPosts }));

import { data } from "./+data";

afterEach(() => {
  vi.clearAllMocks();
});

describe("blog +data", () => {
  it("returns posts on success", async () => {
    getBlogPosts.mockResolvedValue([{ id: "1", title: "Post" }]);
    const result = await data({ lang: "en" });

    expect(getBlogPosts).toHaveBeenCalledWith("en");
    expect(result).toEqual({ posts: [{ id: "1", title: "Post" }], fetchError: false });
  });

  it("defaults to the default language when pageContext.lang is unset", async () => {
    getBlogPosts.mockResolvedValue([]);
    await data({});
    expect(getBlogPosts).toHaveBeenCalledWith("hu");
  });

  it("returns an empty list and fetchError:true when the API call fails", async () => {
    getBlogPosts.mockRejectedValue(new Error("network down"));
    const result = await data({ lang: "de" });
    expect(result).toEqual({ posts: [], fetchError: true });
  });
});
