import { describe, expect, it, vi, afterEach } from "vitest";
import { render } from "@testing-library/react";
import { createElement } from "react";
import { useScrollReveal } from "./use-scroll-reveal";

function TestComponent() {
  const ref = useScrollReveal<HTMLDivElement>();
  return createElement("div", { ref, "data-testid": "target" });
}

describe("useScrollReveal", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("arms the element for a scroll-triggered reveal", () => {
    const { getByTestId } = render(createElement(TestComponent));
    expect(getByTestId("target").classList.contains("scroll-reveal-armed")).toBe(true);
  });

  it("does not arm the element when reduced motion is preferred", () => {
    vi.stubGlobal(
      "matchMedia",
      vi.fn().mockReturnValue({
        matches: true,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })
    );

    const { getByTestId } = render(createElement(TestComponent));
    expect(getByTestId("target").classList.contains("scroll-reveal-armed")).toBe(false);
  });
});
