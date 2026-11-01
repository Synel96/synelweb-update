import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { markdownComponents } from "./+Page";

describe("blog post markdownComponents.a", () => {
  it("keeps a relative internal link in the same tab", () => {
    render(markdownComponents.a({ href: "/kapcsolat", children: "Kapcsolat" }));
    const link = screen.getByRole("link", { name: "Kapcsolat" });
    expect(link).not.toHaveAttribute("target");
    expect(link).not.toHaveAttribute("rel");
  });

  it("keeps an absolute link back to the site itself in the same tab", () => {
    render(
      markdownComponents.a({
        href: "https://synelweb.hu/hu/kapcsolat",
        children: "Kérj ingyenes konzultációt",
      })
    );
    const link = screen.getByRole("link", { name: "Kérj ingyenes konzultációt" });
    expect(link).not.toHaveAttribute("target");
    expect(link).not.toHaveAttribute("rel");
  });

  it("opens a genuinely external link in a new tab", () => {
    render(markdownComponents.a({ href: "https://example.com", children: "External" }));
    const link = screen.getByRole("link", { name: "External" });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });
});
