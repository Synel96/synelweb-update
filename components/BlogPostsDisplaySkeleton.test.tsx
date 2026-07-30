import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import BlogPostsDisplaySkeleton from "./BlogPostsDisplaySkeleton";

describe("BlogPostsDisplaySkeleton", () => {
  it("renders the default number of skeleton cards (6)", () => {
    const { container } = render(<BlogPostsDisplaySkeleton />);
    expect(container.querySelectorAll("article")).toHaveLength(6);
  });

  it("renders a custom number of skeleton cards", () => {
    const { container } = render(<BlogPostsDisplaySkeleton count={3} />);
    expect(container.querySelectorAll("article")).toHaveLength(3);
  });
});
