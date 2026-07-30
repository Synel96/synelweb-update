import { afterEach, describe, expect, it, vi } from "vitest";
import { prefersReducedMotion } from "./prefersReducedMotion";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("prefersReducedMotion", () => {
  it("returns whatever matchMedia reports for the reduce-motion query", () => {
    vi.spyOn(window, "matchMedia").mockReturnValue({
      matches: true,
    } as MediaQueryList);

    expect(prefersReducedMotion()).toBe(true);
  });

  it("returns false when the user has no reduced-motion preference", () => {
    vi.spyOn(window, "matchMedia").mockReturnValue({
      matches: false,
    } as MediaQueryList);

    expect(prefersReducedMotion()).toBe(false);
  });
});
