import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { ServiceCardSkeleton } from "./ServiceCardSkeleton";

describe("ServiceCardSkeleton", () => {
  it("renders a set of skeleton placeholders", () => {
    const { container } = render(<ServiceCardSkeleton />);
    expect(container.querySelectorAll('[data-slot="skeleton"]').length).toBeGreaterThan(0);
  });
});
