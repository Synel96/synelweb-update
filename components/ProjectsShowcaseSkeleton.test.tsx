import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { ProjectsShowcaseSkeleton } from "./ProjectsShowcaseSkeleton";

describe("ProjectsShowcaseSkeleton", () => {
  it("renders a set of skeleton placeholders", () => {
    const { container } = render(<ProjectsShowcaseSkeleton />);
    expect(container.querySelectorAll('[data-slot="skeleton"]').length).toBeGreaterThan(0);
  });
});
