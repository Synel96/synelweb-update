import { afterEach, describe, expect, it, vi } from "vitest";
import { getProjects } from "./projectServices";

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

const CLOUD_NAME = "dmwulp3dl";

describe("getProjects", () => {
  it("throws when the response is not ok", async () => {
    mockFetchOnce([], false);
    await expect(getProjects("en")).rejects.toThrow("Failed to fetch projects.");
  });

  it("filters out inactive projects", async () => {
    mockFetchOnce([
      { id: 1, name: "Hidden", isActive: false },
      { id: 2, name: "Visible", isActive: true },
    ]);
    const projects = await getProjects("en");
    expect(projects.map((p) => p.name)).toEqual(["Visible"]);
  });

  it("localizes the description for the requested language", async () => {
    mockFetchOnce([
      { id: 1, name: "Proj", description: { en: "English text", hu: "Magyar szoveg" } },
    ]);
    const [project] = await getProjects("hu");
    expect(project.description).toBe("Magyar szoveg");
  });

  it("de-duplicates and normalizes image URL candidates from many legacy fields", async () => {
    mockFetchOnce([
      {
        id: 1,
        name: "Proj",
        images: [`https://res.cloudinary.com/${CLOUD_NAME}/image/upload/a.png`],
        preview_image_url: `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/a.png`,
        image: `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/b.png`,
      },
    ]);
    const [project] = await getProjects("en");
    // "a.png" appears twice across different fields but should only be counted once.
    expect(project.previewImage).toBe(
      `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/f_auto,q_auto/a.png`
    );
    expect(project.otherImages).toEqual([
      `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/f_auto,q_auto/b.png`,
    ]);
  });

  it("passes a raw (non-Cloudinary) absolute URL through withCloudinaryAutoParams unchanged", async () => {
    mockFetchOnce([{ id: 1, name: "Proj", image: "https://example.com/pic.png" }]);
    const [project] = await getProjects("en");
    expect(project.previewImage).toBe("https://example.com/pic.png");
  });

  it("defaults stack, scores and liveUrl when absent", async () => {
    mockFetchOnce([{ id: 1, name: "Proj" }]);
    const [project] = await getProjects("en");
    expect(project.stack).toEqual([]);
    expect(project.mobileScores).toEqual([]);
    expect(project.desktopScores).toEqual([]);
    expect(project.liveUrl).toBe("");
    expect(project.previewImage).toBe("");
    expect(project.otherImages).toEqual([]);
  });

  it("sorts by order, falling back to id", async () => {
    mockFetchOnce([
      { id: 5, name: "B", order: 2 },
      { id: 1, name: "A", order: 1 },
    ]);
    const projects = await getProjects("en");
    expect(projects.map((p) => p.name)).toEqual(["A", "B"]);
  });
});
