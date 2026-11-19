import { describe, expect, it, vi } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import { renderWithI18n } from "../../test/render";

vi.mock("vike-react/usePageContext", () => ({ usePageContext: () => ({ lang: "hu" }) }));
vi.mock("@/components/QuoteRequestForm", () => ({ QuoteRequestForm: () => null }));

import Page from "./+Page";

describe("contact page map", () => {
  it("loads Google's map only after the visitor asks for it", async () => {
    const { container } = await renderWithI18n(<Page />);

    expect(container.querySelector("iframe")).toBeNull();
    expect(screen.getByRole("link", { name: "Megnyitás a Google Térképen" })).toHaveAttribute(
      "href",
      "https://www.google.com/maps?q=Sopron"
    );

    fireEvent.click(screen.getByRole("button", { name: "Térkép megjelenítése" }));

    expect(container.querySelector("iframe")?.getAttribute("src")).toContain("output=embed");
  });
});
