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

  it("asks for a screen-sized image, decoded with the page so it can't flash in late", () => {
    const { container } = render(<PageHeroBackground />);
    const image = container.querySelector("img");

    expect(image?.getAttribute("src")).toContain("c_limit,w_1920");
    expect(image?.getAttribute("srcset")).toContain("w_768");
    expect(image?.getAttribute("srcset")).toContain("2560w");
    expect(image?.getAttribute("decoding")).toBe("sync");
  });
});
