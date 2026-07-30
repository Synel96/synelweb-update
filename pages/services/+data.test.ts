import { afterEach, describe, expect, it, vi } from "vitest";

const { getServiceCards } = vi.hoisted(() => ({ getServiceCards: vi.fn() }));
vi.mock("@/src/services/serviceCardsService", () => ({ getServiceCards }));

import { data } from "./+data";

afterEach(() => {
  vi.clearAllMocks();
});

describe("services +data", () => {
  it("returns cards and a localized contact href on success", async () => {
    getServiceCards.mockResolvedValue([{ id: "1", name: "Package" }]);
    const result = await data({ lang: "de" });

    expect(getServiceCards).toHaveBeenCalledWith("de");
    expect(result.cards).toEqual([{ id: "1", name: "Package" }]);
    expect(result.fetchError).toBe(false);
    expect(result.contactHref).toBe("/de/kontakt");
  });

  it("defaults to the default language when pageContext.lang is unset", async () => {
    getServiceCards.mockResolvedValue([]);
    await data({});
    expect(getServiceCards).toHaveBeenCalledWith("hu");
  });

  it("returns an empty list and fetchError:true when the API call fails", async () => {
    getServiceCards.mockRejectedValue(new Error("network down"));
    const result = await data({ lang: "en" });

    expect(result.cards).toEqual([]);
    expect(result.fetchError).toBe(true);
    expect(result.contactHref).toBe("/en/contact");
  });
});
