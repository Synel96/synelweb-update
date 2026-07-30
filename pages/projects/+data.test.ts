import { afterEach, describe, expect, it, vi } from "vitest";

const { getProjects } = vi.hoisted(() => ({ getProjects: vi.fn() }));
vi.mock("@/src/services/projectServices", () => ({ getProjects }));

import { data } from "./+data";

afterEach(() => {
  vi.clearAllMocks();
});

describe("projects +data", () => {
  it("returns projects on success", async () => {
    getProjects.mockResolvedValue([{ id: "1", name: "Project" }]);
    const result = await data({ lang: "en" });

    expect(getProjects).toHaveBeenCalledWith("en");
    expect(result).toEqual({ projects: [{ id: "1", name: "Project" }], fetchError: false });
  });

  it("defaults to the default language when pageContext.lang is unset", async () => {
    getProjects.mockResolvedValue([]);
    await data({});
    expect(getProjects).toHaveBeenCalledWith("hu");
  });

  it("returns an empty list and fetchError:true when the API call fails", async () => {
    getProjects.mockRejectedValue(new Error("network down"));
    const result = await data({ lang: "de" });
    expect(result).toEqual({ projects: [], fetchError: true });
  });
});
