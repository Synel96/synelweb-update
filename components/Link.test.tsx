import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

const { usePageContext } = vi.hoisted(() => ({ usePageContext: vi.fn() }));
vi.mock("vike-react/usePageContext", () => ({ usePageContext }));

import { Link } from "./Link";

// Note: this component isn't referenced anywhere else in the codebase (Navbar
// implements its own active-link logic instead, calling
// resolveLanguageAndLogicalPath to strip the lang prefix first). Link.tsx
// compares the raw pageContext.urlPathname directly against the bare `href`
// prop without stripping a lang prefix, so `isActive` only works correctly
// when urlPathname has no lang prefix — these tests describe that literal
// behavior, not a claim that it behaves correctly for prefixed app routes.
describe("Link", () => {
  it("localizes the href for the current language", () => {
    usePageContext.mockReturnValue({ urlPathname: "/about", lang: "hu" });
    render(<Link href="/about">Rólam</Link>);
    expect(screen.getByRole("link", { name: "Rólam" })).toHaveAttribute("href", "/hu/rolam");
  });

  it("defaults to the default language when pageContext.lang is unset", () => {
    usePageContext.mockReturnValue({ urlPathname: "/about" });
    render(<Link href="/about">Rólam</Link>);
    expect(screen.getByRole("link", { name: "Rólam" })).toHaveAttribute("href", "/hu/rolam");
  });

  it("marks the link active when urlPathname starts with an unprefixed href", () => {
    usePageContext.mockReturnValue({ urlPathname: "/services/sub-page", lang: "en" });
    render(<Link href="/services">Services</Link>);
    expect(screen.getByRole("link", { name: "Services" })).toHaveClass("is-active");
  });

  it("does not mark non-matching links active", () => {
    usePageContext.mockReturnValue({ urlPathname: "/services", lang: "en" });
    render(<Link href="/about">About</Link>);
    expect(screen.getByRole("link", { name: "About" })).not.toHaveClass("is-active");
  });

  it("only marks the root link active on an exact match, not as a prefix", () => {
    usePageContext.mockReturnValue({ urlPathname: "/services", lang: "en" });
    render(<Link href="/">Home</Link>);
    expect(screen.getByRole("link", { name: "Home" })).not.toHaveClass("is-active");
  });

  it("marks the root link active when urlPathname is exactly /", () => {
    usePageContext.mockReturnValue({ urlPathname: "/", lang: "en" });
    render(<Link href="/">Home</Link>);
    expect(screen.getByRole("link", { name: "Home" })).toHaveClass("is-active");
  });

  it("does NOT mark a link active against a real (lang-prefixed) urlPathname, illustrating the gap", () => {
    usePageContext.mockReturnValue({ urlPathname: "/en/services", lang: "en" });
    render(<Link href="/services">Services</Link>);
    expect(screen.getByRole("link", { name: "Services" })).not.toHaveClass("is-active");
  });
});
