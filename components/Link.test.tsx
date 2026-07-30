import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

const { usePageContext } = vi.hoisted(() => ({ usePageContext: vi.fn() }));
vi.mock("vike-react/usePageContext", () => ({ usePageContext }));

import { Link } from "./Link";

// Note: this component isn't referenced anywhere else in the codebase (Navbar
// implements its own active-link logic inline instead), but it now strips the
// lang prefix from pageContext.urlPathname the same way Navbar does before
// comparing against the bare `href` prop.
describe("Link", () => {
  it("localizes the href for the current language", () => {
    usePageContext.mockReturnValue({ urlPathname: "/en/about", lang: "hu" });
    render(<Link href="/about">Rólam</Link>);
    expect(screen.getByRole("link", { name: "Rólam" })).toHaveAttribute("href", "/hu/rolam");
  });

  it("defaults to the default language when pageContext.lang is unset", () => {
    usePageContext.mockReturnValue({ urlPathname: "/about" });
    render(<Link href="/about">Rólam</Link>);
    expect(screen.getByRole("link", { name: "Rólam" })).toHaveAttribute("href", "/hu/rolam");
  });

  it("marks the link active against a real, lang-prefixed urlPathname", () => {
    usePageContext.mockReturnValue({ urlPathname: "/en/services", lang: "en" });
    render(<Link href="/services">Services</Link>);
    expect(screen.getByRole("link", { name: "Services" })).toHaveClass("is-active");
  });

  it("marks the link active as a prefix match for an unmapped (non-localized-segment) path", () => {
    // KNOWN_LOGICAL_PATHS sub-paths aren't remapped by resolveLanguageAndLogicalPath
    // (only exact localized segments are), so prefix matching is only meaningfully
    // testable here on a path outside that mapping, like /adatkezeles.
    usePageContext.mockReturnValue({ urlPathname: "/adatkezeles/sub-page", lang: "hu" });
    render(<Link href="/adatkezeles">Privacy</Link>);
    expect(screen.getByRole("link", { name: "Privacy" })).toHaveClass("is-active");
  });

  it("does not mark non-matching links active", () => {
    usePageContext.mockReturnValue({ urlPathname: "/en/services", lang: "en" });
    render(<Link href="/about">About</Link>);
    expect(screen.getByRole("link", { name: "About" })).not.toHaveClass("is-active");
  });

  it("only marks the root link active on an exact match, not as a prefix", () => {
    usePageContext.mockReturnValue({ urlPathname: "/en/services", lang: "en" });
    render(<Link href="/">Home</Link>);
    expect(screen.getByRole("link", { name: "Home" })).not.toHaveClass("is-active");
  });

  it("marks the root link active when the path is exactly the localized root", () => {
    usePageContext.mockReturnValue({ urlPathname: "/en/", lang: "en" });
    render(<Link href="/">Home</Link>);
    expect(screen.getByRole("link", { name: "Home" })).toHaveClass("is-active");
  });
});
