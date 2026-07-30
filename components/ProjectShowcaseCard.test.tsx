import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProjectShowcaseCard } from "./ProjectShowcaseCard";

const shortDescription = "Short.";
const longDescription = "L".repeat(221);

const baseProps = {
  title: "Acme Website",
  previewImage: "https://example.com/preview.png",
  otherImages: [],
  description: shortDescription,
  expandLabel: "Show more",
  collapseLabel: "Show less",
  stackTitle: "Tech stack",
  stack: [{ name: "React", logo: "react" as const }],
  scoresTitle: "Lighthouse",
  mobileScoresLabel: "Mobile",
  desktopScoresLabel: "Desktop",
  mobileScores: [{ label: "Performance", value: 95 }],
  desktopScores: [{ label: "Performance", value: 99 }],
  liveHref: "https://example.com",
  liveLabel: "Visit site",
};

beforeEach(() => {
  vi.spyOn(window, "scrollTo").mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("ProjectShowcaseCard", () => {
  it("renders the title as an h3 by default and the description", () => {
    render(<ProjectShowcaseCard {...baseProps} />);
    const heading = screen.getByRole("heading", { name: "Acme Website" });
    expect(heading.tagName).toBe("H3");
    expect(screen.getByText(shortDescription)).toBeInTheDocument();
  });

  it("renders the title as an h2 when headingLevel is set", () => {
    render(<ProjectShowcaseCard {...baseProps} headingLevel="h2" />);
    expect(screen.getByRole("heading", { name: "Acme Website" }).tagName).toBe("H2");
  });

  it("does not show an expand toggle for a short description", () => {
    render(<ProjectShowcaseCard {...baseProps} />);
    expect(screen.queryByRole("button", { name: "Show more" })).not.toBeInTheDocument();
  });

  it("expands and collapses a long description", async () => {
    render(<ProjectShowcaseCard {...baseProps} description={longDescription} />);
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: "Show more" }));
    expect(screen.getByRole("button", { name: "Show less" })).toHaveAttribute(
      "aria-expanded",
      "true"
    );
  });

  it("renders the technology stack list", () => {
    render(
      <ProjectShowcaseCard
        {...baseProps}
        stack={[
          { name: "React", logo: "react" },
          { name: "Django", logo: "django" },
        ]}
      />
    );
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("Django")).toBeInTheDocument();
  });

  it("renders mobile and desktop Lighthouse score labels", () => {
    render(<ProjectShowcaseCard {...baseProps} />);
    expect(screen.getByText("Mobile")).toBeInTheDocument();
    expect(screen.getByText("Desktop")).toBeInTheDocument();
    expect(screen.getAllByText("Performance")).toHaveLength(2);
  });

  it("renders a live link opening in a new tab", () => {
    render(<ProjectShowcaseCard {...baseProps} />);
    const link = screen.getByRole("link", { name: /visit site/i });
    expect(link).toHaveAttribute("href", "https://example.com");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noreferrer");
  });
});
