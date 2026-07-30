import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { AboutProfileAvatar } from "./AboutProfileAvatar";

describe("AboutProfileAvatar", () => {
  it("shows a loading skeleton and a transparent image before it loads", () => {
    const { container } = render(<AboutProfileAvatar />);
    expect(container.querySelector('[data-slot="skeleton"]')).not.toBeNull();
    const img = screen.getByRole("img");
    expect(img.className).toContain("opacity-0");
  });

  it("hides the skeleton and fades in the image once it loads", () => {
    const { container } = render(<AboutProfileAvatar />);
    const img = screen.getByRole("img");

    fireEvent.load(img);

    expect(img.className).toContain("opacity-100");
    expect(container.querySelector('[data-slot="skeleton"]')).toBeNull();
  });

  it("also stops showing the skeleton if the image fails to load", () => {
    const { container } = render(<AboutProfileAvatar />);
    const img = screen.getByRole("img");

    fireEvent.error(img);

    expect(img.className).toContain("opacity-100");
    expect(container.querySelector('[data-slot="skeleton"]')).toBeNull();
  });

  it("uses the provided alt text and className", () => {
    const { container } = render(<AboutProfileAvatar alt="Custom alt" className="extra-class" />);
    expect(screen.getByAltText("Custom alt")).toBeInTheDocument();
    expect(container.firstElementChild?.className).toContain("extra-class");
  });
});
