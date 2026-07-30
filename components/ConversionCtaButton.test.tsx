import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ConversionCtaButton } from "./ConversionCtaButton";

describe("ConversionCtaButton", () => {
  it("renders an anchor with the given href and label text", () => {
    render(<ConversionCtaButton href="/contact">Book a call</ConversionCtaButton>);
    const link = screen.getByRole("link", { name: /book a call/i });
    expect(link).toHaveAttribute("href", "/contact");
  });

  it("applies the provided aria-label", () => {
    render(
      <ConversionCtaButton href="/contact" ariaLabel="Go to contact">
        Book a call
      </ConversionCtaButton>
    );
    expect(screen.getByRole("link", { name: "Go to contact" })).toBeInTheDocument();
  });

  it("merges a custom className with the default classes", () => {
    render(
      <ConversionCtaButton href="/contact" className="my-extra-class">
        Book a call
      </ConversionCtaButton>
    );
    const link = screen.getByRole("link", { name: /book a call/i });
    expect(link.className).toContain("my-extra-class");
    expect(link.className).toContain("btn-cta");
  });
});
