import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { TFunction } from "i18next";
import { getTestI18n } from "../test/i18n-test-instance";
import BlogPostsPagination from "./BlogPostsPagination";

async function getT(): Promise<TFunction> {
  const i18n = await getTestI18n("en");
  return i18n.getFixedT("en");
}

describe("BlogPostsPagination", () => {
  it("renders nothing when there is only one page", async () => {
    const t = await getT();
    const { container } = render(
      <BlogPostsPagination currentPage={1} totalPages={1} onPageChange={vi.fn()} t={t} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("renders every page number when the total is small", async () => {
    const t = await getT();
    render(<BlogPostsPagination currentPage={2} totalPages={4} onPageChange={vi.fn()} t={t} />);

    for (const page of [1, 2, 3, 4]) {
      expect(screen.getByRole("button", { name: `Page ${page}` })).toBeInTheDocument();
    }
  });

  it("marks the current page as active", async () => {
    const t = await getT();
    render(<BlogPostsPagination currentPage={2} totalPages={4} onPageChange={vi.fn()} t={t} />);
    expect(screen.getByRole("button", { name: "Page 2" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("button", { name: "Page 1" })).not.toHaveAttribute("aria-current");
  });

  it("collapses distant pages behind an ellipsis for a large total", async () => {
    const t = await getT();
    render(<BlogPostsPagination currentPage={5} totalPages={20} onPageChange={vi.fn()} t={t} />);

    expect(screen.getByRole("button", { name: "Page 1" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Page 20" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Page 4" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Page 5" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Page 6" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Page 3" })).not.toBeInTheDocument();
    expect(screen.getAllByText("More pages")).toHaveLength(2);
  });

  it("disables Previous on the first page and Next on the last page", async () => {
    const t = await getT();
    const { rerender } = render(
      <BlogPostsPagination currentPage={1} totalPages={3} onPageChange={vi.fn()} t={t} />
    );
    expect(screen.getByRole("button", { name: "Previous" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Next" })).toBeEnabled();

    rerender(<BlogPostsPagination currentPage={3} totalPages={3} onPageChange={vi.fn()} t={t} />);
    expect(screen.getByRole("button", { name: "Previous" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();
  });

  it("calls onPageChange with the target page for prev/next/page clicks", async () => {
    const t = await getT();
    const onPageChange = vi.fn();
    render(
      <BlogPostsPagination currentPage={2} totalPages={4} onPageChange={onPageChange} t={t} />
    );
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: "Previous" }));
    expect(onPageChange).toHaveBeenLastCalledWith(1);

    await user.click(screen.getByRole("button", { name: "Next" }));
    expect(onPageChange).toHaveBeenLastCalledWith(3);

    await user.click(screen.getByRole("button", { name: "Page 4" }));
    expect(onPageChange).toHaveBeenLastCalledWith(4);
  });
});
