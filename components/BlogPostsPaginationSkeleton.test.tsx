import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import BlogPostsPaginationSkeleton from "./BlogPostsPaginationSkeleton";

describe("BlogPostsPaginationSkeleton", () => {
  it("renders a set of skeleton placeholders", () => {
    const { container } = render(<BlogPostsPaginationSkeleton />);
    expect(container.querySelectorAll('[data-slot="skeleton"]').length).toBeGreaterThan(0);
  });
});
