import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ServiceCard } from "./ServiceCard";

const shortDescription = "A short description.";
const longDescription = "L".repeat(221);

const baseProps = {
  serviceName: "Landing page",
  description: shortDescription,
  regularPrice: "199 000 Ft",
  discountedPrice: "",
  hasDiscount: false,
  discountLabel: "Sale",
  expandLabel: "Show more",
  collapseLabel: "Show less",
  slug: "landing-page",
  images: [] as string[],
  contactBaseHref: "/en/contact",
  ctaLabel: "Request a quote",
  ctaAriaLabel: "Request a quote for Landing page",
};

beforeEach(() => {
  vi.spyOn(window, "scrollTo").mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("ServiceCard", () => {
  it("renders the service name, description and regular price", () => {
    render(<ServiceCard {...baseProps} />);
    expect(screen.getByRole("heading", { name: "Landing page" })).toBeInTheDocument();
    expect(screen.getByText(shortDescription)).toBeInTheDocument();
    expect(screen.getByText("199 000 Ft")).toBeInTheDocument();
  });

  it("shows a discount badge and struck-through original price when discounted", () => {
    render(<ServiceCard {...baseProps} hasDiscount discountedPrice="149 000 Ft" />);
    expect(screen.getByText("Sale")).toBeInTheDocument();
    expect(screen.getByText("199 000 Ft")).toBeInTheDocument();
    expect(screen.getByText("149 000 Ft")).toBeInTheDocument();
  });

  it("does not show an expand button for a short description", () => {
    render(<ServiceCard {...baseProps} />);
    expect(screen.queryByRole("button", { name: "Show more" })).not.toBeInTheDocument();
  });

  it("shows an expand/collapse toggle for a long description", async () => {
    render(<ServiceCard {...baseProps} description={longDescription} />);
    const user = userEvent.setup();

    const toggle = screen.getByRole("button", { name: "Show more" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");

    await user.click(toggle);
    expect(screen.getByRole("button", { name: "Show less" })).toHaveAttribute(
      "aria-expanded",
      "true"
    );

    await user.click(screen.getByRole("button", { name: "Show less" }));
    expect(screen.getByRole("button", { name: "Show more" })).toHaveAttribute(
      "aria-expanded",
      "false"
    );
  });

  it("does not render an image carousel when there are no images", () => {
    render(<ServiceCard {...baseProps} />);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Next image" })).not.toBeInTheDocument();
  });

  it("renders images and only shows prev/next controls when there is more than one", () => {
    const { rerender } = render(
      <ServiceCard {...baseProps} images={["https://example.com/a.png"]} />
    );
    expect(screen.getAllByRole("img")).toHaveLength(1);
    expect(screen.queryByRole("button", { name: "Next image" })).not.toBeInTheDocument();

    rerender(
      <ServiceCard
        {...baseProps}
        images={["https://example.com/a.png", "https://example.com/b.png"]}
      />
    );
    expect(screen.getAllByRole("img")).toHaveLength(2);
    expect(screen.getByRole("button", { name: "Next image" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Go to image 1" })).toBeInTheDocument();
  });

  it("filters out blank image entries", () => {
    render(<ServiceCard {...baseProps} images={["", "   "]} />);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("builds the CTA href with the URL-encoded slug appended as a query param", () => {
    render(<ServiceCard {...baseProps} slug="seo & ads" />);
    expect(screen.getByRole("link", { name: baseProps.ctaAriaLabel })).toHaveAttribute(
      "href",
      "/en/contact?service=seo%20%26%20ads"
    );
  });
});
