import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { TFunction } from "i18next";
import { getTestI18n } from "../test/i18n-test-instance";
import BlogPostsDisplay from "./BlogPostsDisplay";
import type { BlogPost } from "@/src/services/blogPostsService";

async function getT(lang: "hu" | "en" | "de" = "en"): Promise<TFunction> {
  const i18n = await getTestI18n(lang);
  return i18n.getFixedT(lang);
}

const post: BlogPost = {
  id: "1",
  title: "Hello world",
  description: "A short post about testing.",
  previewImageUrl: "https://example.com/pic.png",
  category: "professional",
  createdAt: "2026-03-05T00:00:00Z",
};

describe("BlogPostsDisplay", () => {
  it("renders the post title, description and formatted date", async () => {
    const t = await getT("en");
    render(<BlogPostsDisplay posts={[post]} locale="en" t={t} />);

    expect(screen.getByRole("heading", { name: "Hello world" })).toBeInTheDocument();
    expect(screen.getByText("A short post about testing.")).toBeInTheDocument();
    expect(screen.getByText("2026. március 05.")).toBeInTheDocument();
  });

  it("links to the post detail page under the resolved language prefix", async () => {
    const t = await getT("de");
    render(<BlogPostsDisplay posts={[post]} locale="de" t={t} />);

    expect(screen.getByRole("link", { name: /vollständigen beitrag lesen/i })).toHaveAttribute(
      "href",
      "/de/blog/1"
    );
  });

  it("falls back to the untitled/description-fallback translations when fields are blank", async () => {
    const t = await getT("en");
    render(
      <BlogPostsDisplay posts={[{ ...post, title: "", description: "" }]} locale="en" t={t} />
    );

    expect(screen.getByText(t("blogPage.untitled"))).toBeInTheDocument();
    expect(screen.getByText(t("blogPage.descriptionFallback"))).toBeInTheDocument();
  });

  it("does not render a preview image when the URL is blank", async () => {
    const t = await getT("en");
    render(<BlogPostsDisplay posts={[{ ...post, previewImageUrl: "  " }]} locale="en" t={t} />);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("shows the right category label for each category", async () => {
    const t = await getT("en");
    render(
      <BlogPostsDisplay
        posts={[
          { ...post, id: "1", category: "casual" },
          { ...post, id: "2", category: "dirty-financials" },
          { ...post, id: "3", category: "unknown-category" },
        ]}
        locale="en"
        t={t}
      />
    );

    expect(screen.getByText("Casual")).toBeInTheDocument();
    expect(screen.getByText("Dirty financials")).toBeInTheDocument();
    expect(screen.getByText("Professional")).toBeInTheDocument();
  });

  it("omits the date badge when createdAt doesn't parse", async () => {
    const t = await getT("en");
    render(<BlogPostsDisplay posts={[{ ...post, createdAt: "not-a-date" }]} locale="en" t={t} />);
    expect(screen.queryByText(/^\d{4}\./)).not.toBeInTheDocument();
  });

  it("does not show an expand toggle for a short description", async () => {
    const t = await getT("en");
    render(<BlogPostsDisplay posts={[post]} locale="en" t={t} />);
    expect(screen.queryByRole("button", { name: "Read more" })).not.toBeInTheDocument();
  });

  it("shows a localized expand/collapse toggle for a long description and expands it on click", async () => {
    const t = await getT("hu");
    const longDescription = "L".repeat(221);
    render(
      <BlogPostsDisplay posts={[{ ...post, description: longDescription }]} locale="hu" t={t} />
    );
    const user = userEvent.setup();

    const toggle = screen.getByRole("button", { name: "Több" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");

    await user.click(toggle);
    expect(screen.getByRole("button", { name: "Kevesebb" })).toHaveAttribute(
      "aria-expanded",
      "true"
    );
  });

  it("keeps each blog card's expand state independent from the others", async () => {
    const t = await getT("en");
    const longDescription = "L".repeat(221);
    render(
      <BlogPostsDisplay
        posts={[
          { ...post, id: "1", title: "First", description: longDescription },
          { ...post, id: "2", title: "Second", description: longDescription },
        ]}
        locale="en"
        t={t}
      />
    );
    const user = userEvent.setup();

    const [firstToggle, secondToggle] = screen.getAllByRole("button", { name: "Read more" });
    await user.click(firstToggle);

    expect(screen.getByRole("button", { name: "Show less" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Read more" })).toBe(secondToggle);
  });
});
