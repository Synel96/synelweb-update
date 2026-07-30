import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const { usePageContext, navigate } = vi.hoisted(() => ({
  usePageContext: vi.fn(),
  navigate: vi.fn(),
}));
vi.mock("vike-react/usePageContext", () => ({ usePageContext }));
vi.mock("vike/client/router", () => ({ navigate }));

import { LanguageSwitcher, LanguageSwitcherDropdown } from "./LanguageSwitcher";

afterEach(() => {
  sessionStorage.clear();
});

describe("LanguageSwitcher", () => {
  it("renders a button for each supported language", () => {
    usePageContext.mockReturnValue({ urlPathname: "/en/about", lang: "en" });
    render(<LanguageSwitcher />);
    expect(screen.getByRole("button", { name: /Switch to EN/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Switch to HU/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Switch to DE/i })).toBeInTheDocument();
  });

  it("marks the current language as pressed", () => {
    usePageContext.mockReturnValue({ urlPathname: "/en/about", lang: "en" });
    render(<LanguageSwitcher />);
    expect(screen.getByRole("button", { name: /Switch to EN/i })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
    expect(screen.getByRole("button", { name: /Switch to HU/i })).toHaveAttribute(
      "aria-pressed",
      "false"
    );
  });

  it("navigates to the localized equivalent path and preserves scroll position on switch", async () => {
    usePageContext.mockReturnValue({ urlPathname: "/en/about", lang: "en" });
    Object.defineProperty(window, "scrollY", { value: 250, configurable: true });
    const user = userEvent.setup();

    render(<LanguageSwitcher />);
    await user.click(screen.getByRole("button", { name: /Switch to HU/i }));

    expect(sessionStorage.getItem("synelweb:preserve-scroll-y")).toBe("250");
    expect(navigate).toHaveBeenCalledWith("/hu/rolam");
  });
});

describe("LanguageSwitcherDropdown", () => {
  it("navigates the same way as the plain switcher", async () => {
    usePageContext.mockReturnValue({ urlPathname: "/hu/szolgaltatasok", lang: "hu" });
    const user = userEvent.setup();

    render(<LanguageSwitcherDropdown />);
    await user.click(screen.getByRole("button", { name: /Switch to DE/i }));

    expect(navigate).toHaveBeenCalledWith("/de/dienstleistungen");
  });

  it("defaults to the default language when pageContext.lang is unset", () => {
    usePageContext.mockReturnValue({ urlPathname: "/" });
    render(<LanguageSwitcherDropdown />);
    expect(screen.getByRole("button", { name: /Switch to HU/i })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
  });
});
