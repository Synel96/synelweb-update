// @vitest-environment node
import { describe, expect, it } from "vitest";
import { prefersReducedMotion } from "./prefersReducedMotion";

describe("prefersReducedMotion (no window / SSR)", () => {
  it("returns false when window is undefined", () => {
    expect(typeof window).toBe("undefined");
    expect(prefersReducedMotion()).toBe(false);
  });
});
