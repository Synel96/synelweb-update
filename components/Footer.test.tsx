import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithI18n } from "../test/render";

const { usePageContext } = vi.hoisted(() => ({ usePageContext: vi.fn() }));
vi.mock("vike-react/usePageContext", () => ({ usePageContext }));

import { Footer } from "./Footer";

describe("Footer", () => {
  it("always links to the (Hungarian-only) privacy notice regardless of active language", async () => {
    usePageContext.mockReturnValue({ lang: "en" });
    await renderWithI18n(<Footer />, "en");

    expect(screen.getByRole("link", { name: "Adatkezelési tájékoztató" })).toHaveAttribute(
      "href",
      "/adatkezeles"
    );
  });

  it("renders localized nav links, hiding blog outside hu", async () => {
    usePageContext.mockReturnValue({ lang: "de" });
    await renderWithI18n(<Footer />, "de");

    expect(screen.getByRole("link", { name: "Kontakt" })).toHaveAttribute("href", "/de/kontakt");
    expect(screen.queryByRole("link", { name: "Blog" })).not.toBeInTheDocument();
  });

  it("shows the current year and default brand name in the copyright line", async () => {
    usePageContext.mockReturnValue({ lang: "en" });
    await renderWithI18n(<Footer />, "en");

    const year = new Date().getFullYear();
    expect(screen.getByText(new RegExp(`${year} SynelWeb`))).toBeInTheDocument();
  });

  it("uses a custom brand name when provided", async () => {
    usePageContext.mockReturnValue({ lang: "en" });
    await renderWithI18n(<Footer brandName="CustomBrand" />, "en");

    expect(screen.getByText(/CustomBrand/)).toBeInTheDocument();
  });

  it("defaults to the default language when pageContext.lang is unset", async () => {
    usePageContext.mockReturnValue({});
    await renderWithI18n(<Footer />, "hu");

    expect(screen.getByRole("link", { name: "Kapcsolat" })).toHaveAttribute(
      "href",
      "/hu/kapcsolat"
    );
  });
});
