import { afterEach, describe, expect, it, vi } from "vitest";

const { getCertificates } = vi.hoisted(() => ({ getCertificates: vi.fn() }));
vi.mock("@/src/services/certificatesService", () => ({ getCertificates }));

import { data } from "./+data";

afterEach(() => {
  vi.clearAllMocks();
});

describe("certificates +data", () => {
  it("returns certificates on success in the page language", async () => {
    getCertificates.mockResolvedValue([{ id: "1" }]);
    expect(await data({ lang: "en" })).toEqual({ certificates: [{ id: "1" }], fetchError: false });
    expect(getCertificates).toHaveBeenCalledWith("en");
  });

  it("returns an empty list and fetchError when the API call fails", async () => {
    getCertificates.mockRejectedValue(new Error("down"));
    expect(await data({})).toEqual({ certificates: [], fetchError: true });
    expect(getCertificates).toHaveBeenCalledWith("hu");
  });
});
