import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { PageHeroBackground } from "./PageHeroBackground";

describe("PageHeroBackground", () => {
  it("renders a decorative, aria-hidden background image", () => {
    const { container } = render(<PageHeroBackground />);
    const wrapper = container.querySelector('[aria-hidden="true"]');
    expect(wrapper).not.toBeNull();

    const image = wrapper?.querySelector("img");
    expect(image).not.toBeNull();
    expect(image?.getAttribute("alt")).toBe("");
    expect(image?.getAttribute("src")).toContain("res.cloudinary.com");
  });
});
