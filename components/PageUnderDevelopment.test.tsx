import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithI18n } from "../test/render";
import { PageUnderDevelopment } from "./PageUnderDevelopment";

describe("PageUnderDevelopment", () => {
  it("renders the given section label and a CTA linking to the contact href", async () => {
    await renderWithI18n(
      <PageUnderDevelopment sectionLabel="Blog" contactHref="/en/contact" />,
      "en"
    );

    expect(screen.getByText("Blog")).toBeInTheDocument();
    const cta = screen.getByRole("link");
    expect(cta).toHaveAttribute("href", "/en/contact");
  });

  it("renders localized copy for the requested language", async () => {
    await renderWithI18n(
      <PageUnderDevelopment sectionLabel="Blog" contactHref="/hu/kapcsolat" />,
      "hu"
    );

    // Sanity check that real hu translations were used, not raw keys.
    expect(screen.queryByText("underDevelopment.title")).not.toBeInTheDocument();
  });
});
