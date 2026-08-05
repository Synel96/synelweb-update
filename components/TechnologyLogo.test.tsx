import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { TechnologyLogo, isTechnologyLogoName } from "./TechnologyLogo";

describe("isTechnologyLogoName", () => {
  it("accepts every known logo name", () => {
    for (const name of ["react", "tailwind", "typescript", "python", "django", "postgresql"]) {
      expect(isTechnologyLogoName(name)).toBe(true);
    }
  });

  it("rejects unknown values", () => {
    expect(isTechnologyLogoName("rust")).toBe(false);
    expect(isTechnologyLogoName(42)).toBe(false);
    expect(isTechnologyLogoName(undefined)).toBe(false);
  });
});

describe("TechnologyLogo", () => {
  it("renders an inline, sanitized SVG for every logo, including react", () => {
    for (const name of [
      "react",
      "typescript",
      "python",
      "django",
      "postgresql",
      "tailwind",
    ] as const) {
      const { container } = render(<TechnologyLogo name={name} />);
      expect(container.querySelector("img")).toBeNull();
      expect(container.querySelector("svg")).not.toBeNull();
    }
  });

  it("strips explicit width/height attributes from the source SVG", () => {
    const { container } = render(<TechnologyLogo name="typescript" />);
    const svg = container.querySelector("svg");
    expect(svg).not.toBeNull();
    // sanitizeSvg strips explicit width/height attributes from the source SVG.
    expect(svg?.getAttribute("width")).toBeNull();
    expect(svg?.getAttribute("height")).toBeNull();
  });

  it("applies the custom className, defaulting to size-12", () => {
    const { container: withDefault } = render(<TechnologyLogo name="python" />);
    expect(withDefault.querySelector("span")?.className).toContain("size-12");

    const { container: withCustom } = render(<TechnologyLogo name="python" className="size-6" />);
    expect(withCustom.querySelector("span")?.className).toContain("size-6");
  });

  it("marks the logo wrapper as decorative", () => {
    const { container } = render(<TechnologyLogo name="django" />);
    expect(container.querySelector('[aria-hidden="true"]')).not.toBeNull();
  });
});
