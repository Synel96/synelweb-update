import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithI18n } from "../test/render";
import { AdsTerms } from "./AdsTerms";

describe("AdsTerms", () => {
  it("lists what the ads service covers and states that results aren't guaranteed", async () => {
    await renderWithI18n(<AdsTerms />);

    expect(screen.getByText("Mit vállalok – és mit nem")).toBeInTheDocument();
    expect(screen.getByText(/Beállítom a konverziómérést/)).toBeInTheDocument();
    expect(screen.getByText(/nem garantálok/)).toBeInTheDocument();
    expect(screen.getByText(/nem része a kezelési díjnak/)).toBeInTheDocument();
  });
});
