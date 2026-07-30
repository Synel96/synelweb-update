import { describe, expect, it, vi } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithI18n } from "../test/render";

const { usePageContext } = vi.hoisted(() => ({ usePageContext: vi.fn() }));
vi.mock("vike-react/usePageContext", () => ({ usePageContext }));

import { Navbar } from "./Navbar";

describe("Navbar", () => {
  it("renders every visible nav link with a localized href", async () => {
    usePageContext.mockReturnValue({ urlPathname: "/en/services", lang: "en" });
    await renderWithI18n(<Navbar />, "en");

    expect(screen.getByRole("link", { name: "Services" })).toHaveAttribute("href", "/en/services");
    expect(screen.getByRole("link", { name: "Projects" })).toHaveAttribute("href", "/en/projects");
  });

  it("hides the blog link for non-hu languages", async () => {
    usePageContext.mockReturnValue({ urlPathname: "/en/", lang: "en" });
    await renderWithI18n(<Navbar />, "en");
    expect(screen.queryByRole("link", { name: "Blog" })).not.toBeInTheDocument();
  });

  it("shows the blog link for hu", async () => {
    usePageContext.mockReturnValue({ urlPathname: "/hu/", lang: "hu" });
    await renderWithI18n(<Navbar />, "hu");
    expect(screen.getAllByRole("link", { name: "Blog" }).length).toBeGreaterThan(0);
  });

  it("renders the language switcher dropdown", async () => {
    usePageContext.mockReturnValue({ urlPathname: "/en/", lang: "en" });
    await renderWithI18n(<Navbar />, "en");
    expect(screen.getByLabelText("Switch to HU")).toBeInTheDocument();
  });

  it("toggles the menu button's open/close icon state when clicked", async () => {
    // Radix's Sheet content is portal-rendered with its own open/close animation
    // timing, which isn't reliably observable via jsdom without extra polyfills;
    // the icon swap is driven directly by our own `open` state, so it's a more
    // robust signal that the click handler actually toggled the menu.
    usePageContext.mockReturnValue({ urlPathname: "/en/about", lang: "en" });
    const { container } = await renderWithI18n(<Navbar />, "en");
    const user = userEvent.setup();

    const menuButton = screen.getByRole("button", { name: /open menu/i });
    const getCloseIconClass = () =>
      container.querySelector(".lucide-x")?.getAttribute("class") ?? "";

    expect(getCloseIconClass()).toContain("scale-0");

    await user.click(menuButton);
    expect(getCloseIconClass()).toContain("scale-100");
  });

  it("adjusts the header background alpha in response to scroll on the home page", async () => {
    usePageContext.mockReturnValue({ urlPathname: "/en/", lang: "en" });
    const { container } = await renderWithI18n(<Navbar />, "en");

    const header = container.querySelector("header") as HTMLElement;
    expect(header.style.backgroundColor).toBe("rgba(11, 15, 25, 0)");

    Object.defineProperty(window, "innerHeight", { value: 500, configurable: true });
    Object.defineProperty(window, "scrollY", { value: 250, configurable: true });
    fireEvent.scroll(window);

    expect(header.style.backgroundColor).toBe("rgba(11, 15, 25, 0.44)");
  });

  it("keeps a constant header background on non-home pages regardless of scroll", async () => {
    usePageContext.mockReturnValue({ urlPathname: "/en/about", lang: "en" });
    const { container } = await renderWithI18n(<Navbar />, "en");

    const header = container.querySelector("header") as HTMLElement;
    expect(header.style.backgroundColor).toBe("rgba(11, 15, 25, 0.88)");
  });
});
