import { afterEach, describe, expect, it, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";

const { fetchWithTimeout } = vi.hoisted(() => ({ fetchWithTimeout: vi.fn() }));
vi.mock("@/src/fetchWithTimeout", () => ({ fetchWithTimeout }));

import { formatMoney, resetHufRatesForTests, roundForDisplay, useHufFormatter } from "./currency";

const nbsp = (text: string) => text.replace(/\s/g, " ");

describe("roundForDisplay", () => {
  it("rounds to a step that suits the amount", () => {
    expect(roundForDisplay(62.4)).toBe(60);
    expect(roundForDisplay(372.46)).toBe(370);
    expect(roundForDisplay(1234)).toBe(1250);
    expect(roundForDisplay(12345)).toBe(12300);
    expect(roundForDisplay(1.2)).toBe(5);
  });
});

describe("formatMoney", () => {
  it("shows foreign amounts rounded, without decimals", () => {
    expect(nbsp(formatMoney(372.46, "EUR", "de"))).toBe("370 €");
    expect(formatMoney(1234.5, "USD", "en")).toBe("$1,250");
  });

  it("keeps HUF exact", () => {
    expect(nbsp(formatMoney(149000, "HUF", "hu"))).toBe("149 000 Ft");
  });
});

describe("useHufFormatter", () => {
  afterEach(() => {
    vi.clearAllMocks();
    resetHufRatesForTests();
  });

  it("converts with the backend rate on the German page", async () => {
    fetchWithTimeout.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ base: "HUF", rates: { EUR: 0.0025, USD: 0.00275 } }),
    });
    const { result } = renderHook(() => useHufFormatter("de"));

    await waitFor(() => expect(nbsp(result.current(200000))).toBe("500 €"));
    expect(fetchWithTimeout.mock.calls[0][0]).toMatch(/\/api\/exchange-rates\/$/);
  });

  it("stays in HUF when the rate can't be loaded", async () => {
    fetchWithTimeout.mockRejectedValue(new Error("offline"));
    const { result } = renderHook(() => useHufFormatter("de"));

    await waitFor(() => expect(fetchWithTimeout).toHaveBeenCalled());
    expect(nbsp(result.current(25000))).toBe("25.000 HUF");
  });

  it("needs no rate on the Hungarian page", () => {
    const { result } = renderHook(() => useHufFormatter("hu"));

    expect(nbsp(result.current(25000))).toBe("25 000 Ft");
    expect(fetchWithTimeout).not.toHaveBeenCalled();
  });
});
