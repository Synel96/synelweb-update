import { describe, expect, it, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { renderWithI18n } from "../../test/render";

const { usePageContext } = vi.hoisted(() => ({ usePageContext: vi.fn() }));
vi.mock("vike-react/usePageContext", () => ({ usePageContext }));

const { getProjects } = vi.hoisted(() => ({ getProjects: vi.fn() }));
vi.mock("@/src/services/projectServices", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/src/services/projectServices")>();
  return { ...actual, getProjects };
});

const { getReviews } = vi.hoisted(() => ({ getReviews: vi.fn() }));
vi.mock("@/src/services/reviewsService", () => ({ getReviews, createReview: vi.fn() }));

import Page from "./+Page";

const sampleProject = {
  id: "1",
  name: "SynelWeb Demo Shop",
  stack: [],
  description: "",
  mobileScores: [],
  desktopScores: [],
  liveUrl: "",
  previewImage: "https://res.cloudinary.com/demo/image/upload/preview.png",
  otherImages: [],
  order: 1,
};

describe("Homepage projects section", () => {
  it("self-heals a failed build-time fetch with a client-side refetch on mount", async () => {
    usePageContext.mockReturnValue({
      lang: "hu",
      data: { projects: [], fetchError: true },
    });
    getReviews.mockResolvedValue([]);
    getProjects.mockResolvedValue([sampleProject]);

    await renderWithI18n(<Page />, "hu");

    // The prerendered snapshot had no projects, so nothing should show yet.
    expect(screen.queryByText("SynelWeb Demo Shop")).not.toBeInTheDocument();

    // The client-side useEffect refetch resolves and fills the carousel in.
    await waitFor(() => expect(getProjects).toHaveBeenCalledWith("hu"));
    expect(await screen.findByText("SynelWeb Demo Shop")).toBeInTheDocument();
  });

  it("keeps the prerendered projects when the client refetch fails", async () => {
    usePageContext.mockReturnValue({
      lang: "hu",
      data: { projects: [sampleProject], fetchError: false },
    });
    getReviews.mockResolvedValue([]);
    getProjects.mockRejectedValue(new Error("network down"));

    await renderWithI18n(<Page />, "hu");

    expect(await screen.findByText("SynelWeb Demo Shop")).toBeInTheDocument();
    await waitFor(() => expect(getProjects).toHaveBeenCalledWith("hu"));
    expect(screen.getByText("SynelWeb Demo Shop")).toBeInTheDocument();
  });
});
