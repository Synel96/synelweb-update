import { afterEach, describe, expect, it, vi } from "vitest";

const { getProjects } = vi.hoisted(() => ({ getProjects: vi.fn() }));
vi.mock("@/src/services/projectServices", () => ({ getProjects }));

const { getReviews } = vi.hoisted(() => ({ getReviews: vi.fn() }));
vi.mock("@/src/services/reviewsService", () => ({ getReviews }));

import { data } from "./+data";

afterEach(() => {
  vi.clearAllMocks();
});

describe("index +data", () => {
  it("returns projects and reviews on success", async () => {
    getProjects.mockResolvedValue([{ id: "1", name: "Project" }]);
    getReviews.mockResolvedValue([{ id: 1, name: "Anna", rating: 5, review: "Great!" }]);
    const result = await data({ lang: "en" });

    expect(getProjects).toHaveBeenCalledWith("en");
    expect(getReviews).toHaveBeenCalledWith("en");
    expect(result).toEqual({
      projects: [{ id: "1", name: "Project" }],
      fetchError: false,
      reviews: [{ id: 1, name: "Anna", rating: 5, review: "Great!" }],
      reviewsFetchError: false,
    });
  });

  it("defaults to the default language when pageContext.lang is unset", async () => {
    getProjects.mockResolvedValue([]);
    getReviews.mockResolvedValue([]);
    await data({});
    expect(getProjects).toHaveBeenCalledWith("hu");
    expect(getReviews).toHaveBeenCalledWith("hu");
  });

  it("returns an empty list and fetchError:true when the projects API call fails", async () => {
    getProjects.mockRejectedValue(new Error("network down"));
    getReviews.mockResolvedValue([]);
    const result = await data({ lang: "de" });
    expect(result).toEqual({ projects: [], fetchError: true, reviews: [], reviewsFetchError: false });
  });

  it("returns an empty list and reviewsFetchError:true when the reviews API call fails, independently of projects", async () => {
    getProjects.mockResolvedValue([{ id: "1", name: "Project" }]);
    getReviews.mockRejectedValue(new Error("network down"));
    const result = await data({ lang: "de" });
    expect(result).toEqual({
      projects: [{ id: "1", name: "Project" }],
      fetchError: false,
      reviews: [],
      reviewsFetchError: true,
    });
  });
});
