import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProjectPreviewCarousel } from "./ProjectPreviewCarousel";

const CLOUD_NAME = "dmwulp3dl";
const CLOUDINARY_IMG = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/v1/pic.jpg`;

describe("ProjectPreviewCarousel", () => {
  it("renders a placeholder with the title when there are no images", () => {
    render(<ProjectPreviewCarousel previewImage="" otherImages={[]} title="My Project" />);
    expect(screen.getByText("My Project")).toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("filters out blank image entries", () => {
    render(
      <ProjectPreviewCarousel previewImage="  " otherImages={["", "  "]} title="My Project" />
    );
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("builds a responsive srcSet for Cloudinary images", () => {
    render(<ProjectPreviewCarousel previewImage={CLOUDINARY_IMG} otherImages={[]} title="Proj" />);
    const img = screen.getByRole("img") as HTMLImageElement;
    expect(img.srcset).toContain("480w");
    expect(img.srcset).toContain("1360w");
    expect(img.src).toContain("f_auto,q_auto");
  });

  it("does not generate a srcSet for a non-Cloudinary image", () => {
    render(
      <ProjectPreviewCarousel
        previewImage="https://example.com/pic.png"
        otherImages={[]}
        title="Proj"
      />
    );
    const img = screen.getByRole("img") as HTMLImageElement;
    expect(img.srcset).toBe("");
    expect(img.src).toBe("https://example.com/pic.png");
  });

  it("renders one slide per non-blank image, with previewImage first", () => {
    render(
      <ProjectPreviewCarousel
        previewImage="https://example.com/a.png"
        otherImages={["https://example.com/b.png"]}
        title="Proj"
      />
    );
    const images = screen.getAllByRole("img");
    expect(images).toHaveLength(2);
    expect(images[0]).toHaveAttribute("alt", "Proj preview 1");
    expect(images[1]).toHaveAttribute("alt", "Proj preview 2");
  });

  it("prioritizes (eager-loads) only the first slide when prioritize is set", () => {
    render(
      <ProjectPreviewCarousel
        previewImage="https://example.com/a.png"
        otherImages={["https://example.com/b.png"]}
        title="Proj"
        prioritize
      />
    );
    const images = screen.getAllByRole("img");
    expect(images[0]).toHaveAttribute("loading", "eager");
    expect(images[0]).toHaveAttribute("fetchpriority", "high");
    expect(images[1]).toHaveAttribute("loading", "lazy");
    expect(images[1]).toHaveAttribute("fetchpriority", "auto");
  });

  it("shows working prev/next/dot controls when there is more than one slide", async () => {
    render(
      <ProjectPreviewCarousel
        previewImage="https://example.com/a.png"
        otherImages={["https://example.com/b.png"]}
        title="Proj"
      />
    );
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Next image" }));
    await user.click(screen.getByRole("button", { name: "Previous image" }));
    await user.click(screen.getByRole("button", { name: "Go to image 2" }));
  });
});
