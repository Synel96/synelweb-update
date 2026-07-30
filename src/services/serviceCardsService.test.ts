import { afterEach, describe, expect, it, vi } from "vitest";
import { getServiceCards } from "./serviceCardsService";

function mockFetchOnce(body: unknown, ok = true) {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok,
      json: async () => body,
    })
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("getServiceCards", () => {
  it("sends the requested language as Accept-Language", async () => {
    mockFetchOnce([]);
    await getServiceCards("de");

    const fetchMock = fetch as unknown as ReturnType<typeof vi.fn>;
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/api/services/"),
      expect.objectContaining({ headers: { "Accept-Language": "de" } })
    );
  });

  it("throws when the response is not ok", async () => {
    mockFetchOnce([], false);
    await expect(getServiceCards("en")).rejects.toThrow("Failed to fetch services.");
  });

  it("filters out inactive items", async () => {
    mockFetchOnce([
      { id: 1, isActive: false, title: { en: "Hidden" } },
      { id: 2, isActive: true, title: { en: "Visible" } },
    ]);

    const cards = await getServiceCards("en");
    expect(cards).toHaveLength(1);
    expect(cards[0].name).toBe("Visible");
  });

  it("treats a missing isActive flag as active", async () => {
    mockFetchOnce([{ id: 1, title: { en: "No flag" } }]);
    const cards = await getServiceCards("en");
    expect(cards).toHaveLength(1);
  });

  it("falls back to hu when the requested language key is missing entirely", async () => {
    mockFetchOnce([{ id: 1, title: { hu: "Magyar" }, slug: { hu: "magyar" }, description: {} }]);
    const cards = await getServiceCards("en");
    expect(cards[0].name).toBe("Magyar");
  });

  it("does NOT fall back when the requested language key is present but empty", async () => {
    mockFetchOnce([{ id: 1, title: { hu: "Magyar", en: "" } }]);
    const cards = await getServiceCards("en");
    expect(cards[0].name).toBe("");
  });

  it("formats HUF prices using Hungarian currency formatting", async () => {
    mockFetchOnce([
      {
        id: 1,
        title: { hu: "Csomag" },
        price: { amount: 49999, currency: "HUF" },
      },
    ]);
    const [card] = await getServiceCards("hu");
    expect(card.regularPrice).toBe("49 999 Ft");
    expect(card.hasDiscount).toBe(false);
    expect(card.discountedPrice).toBe("");
  });

  it("formats USD prices for English visitors", async () => {
    mockFetchOnce([
      {
        id: 1,
        title: { en: "Package" },
        price: { amount: 135, currency: "USD" },
      },
    ]);
    const [card] = await getServiceCards("en");
    expect(card.regularPrice).toBe("$135.00");
  });

  it("reports a discount when a sale price is present", async () => {
    mockFetchOnce([
      {
        id: 1,
        title: { en: "Package" },
        price: { amount: 200, currency: "USD" },
        salePrice: { amount: 150, currency: "USD" },
      },
    ]);
    const [card] = await getServiceCards("en");
    expect(card.hasDiscount).toBe(true);
    expect(card.discountedPrice).toBe("$150.00");
  });

  it("returns an empty price string when the price is missing", async () => {
    mockFetchOnce([{ id: 1, title: { en: "Package" } }]);
    const [card] = await getServiceCards("en");
    expect(card.regularPrice).toBe("");
  });

  it("sorts by order, falling back to id when order is not a number", async () => {
    mockFetchOnce([
      { id: 2, title: { en: "Second" }, order: 2 },
      { id: 1, title: { en: "First" }, order: 1 },
    ]);
    const cards = await getServiceCards("en");
    expect(cards.map((c) => c.name)).toEqual(["First", "Second"]);
  });

  it("filters out non-string image URLs and keeps valid ones", async () => {
    mockFetchOnce([{ id: 1, title: { en: "Package" }, images: ["https://a.png", null, ""] }]);
    const [card] = await getServiceCards("en");
    expect(card.images).toEqual(["https://a.png"]);
  });
});
