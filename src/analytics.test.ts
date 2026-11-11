import { afterEach, describe, expect, it, vi } from "vitest";

const { track } = vi.hoisted(() => ({ track: vi.fn() }));
vi.mock("@vercel/analytics", () => ({ track }));

import { trackEvent } from "./analytics";

describe("trackEvent", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("sends the event with its data, leaving out empty values", () => {
    trackEvent("quote_cta_click", { location: "home_hero", service: "" });

    expect(track).toHaveBeenCalledWith("quote_cta_click", { location: "home_hero" });
  });

  it("never throws when analytics fails", () => {
    track.mockImplementation(() => {
      throw new Error("blocked");
    });

    expect(() =>
      trackEvent("contact_click", { method: "phone", location: "contact_page" })
    ).not.toThrow();
  });
});
