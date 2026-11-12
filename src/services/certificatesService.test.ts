import { afterEach, describe, expect, it, vi } from "vitest";
import {
  formatCertificateDate,
  getCertificates,
  normalizeCertificate,
} from "./certificatesService";

const BASE = {
  id: 1,
  title: "PCEP™ – Certified Entry-Level Python Programmer",
  issuer: "Python Institute (OpenEDG)",
  category: "backend",
  kind: "exam",
  issuedOn: "2025-05-13",
  expiresOn: null,
  isExpired: false,
  hours: null,
  credentialUrl: "https://verify.openedg.org/?id=U8ey.juhf.PKeC",
  credentialId: "U8ey.juhf.PKeC",
  skills: ["Python", " PCEP-30-02 ", ""],
  badgeImage: "",
  order: 0,
};

function mockFetchOnce(body: unknown, ok = true) {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok, json: async () => body }));
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("normalizeCertificate", () => {
  it("keeps a valid item and tidies skills", () => {
    const cert = normalizeCertificate(BASE);
    expect(cert).toMatchObject({ id: "1", category: "backend", kind: "exam", expiresOn: null });
    expect(cert?.skills).toEqual(["Python", "PCEP-30-02"]);
  });

  it("drops items without a title, a valid date or a known category", () => {
    expect(normalizeCertificate({ ...BASE, title: " " })).toBeNull();
    expect(normalizeCertificate({ ...BASE, issuedOn: "13/05/2025" })).toBeNull();
    expect(normalizeCertificate({ ...BASE, category: "design" })).toBeNull();
    expect(normalizeCertificate(null)).toBeNull();
  });

  it("only accepts http(s) links and positive hours", () => {
    const cert = normalizeCertificate({
      ...BASE,
      kind: "course",
      hours: 7.5,
      credentialUrl: "javascript:alert(1)",
      badgeImage: "https://res.cloudinary.com/x/badge.png",
    });
    expect(cert?.credentialUrl).toBe("");
    expect(cert?.badgeImage).toBe("https://res.cloudinary.com/x/badge.png");
    expect(cert?.hours).toBe(7.5);
    expect(normalizeCertificate({ ...BASE, hours: 0 })?.hours).toBeNull();
  });
});

describe("getCertificates", () => {
  it("sends the language, keeps the backend order and drops malformed items", async () => {
    mockFetchOnce([BASE, { title: "broken" }, { ...BASE, id: 2, category: "marketing" }]);
    const certs = await getCertificates("de");

    expect(certs.map((c) => c.id)).toEqual(["1", "2"]);
    const [url, init] = vi.mocked(fetch).mock.calls[0];
    expect(String(url)).toMatch(/\/api\/certificates\/$/);
    expect((init?.headers as Record<string, string>)["Accept-Language"]).toBe("de");
  });

  it("throws when the response is not ok", async () => {
    mockFetchOnce([], false);
    await expect(getCertificates("hu")).rejects.toThrow();
  });
});

describe("formatCertificateDate", () => {
  it("formats in the page language without shifting the day", () => {
    expect(formatCertificateDate("2025-05-13", "hu")).toBe("2025. május 13.");
    expect(formatCertificateDate("2025-05-13", "en")).toBe("May 13, 2025");
    expect(formatCertificateDate("2025-05-13", "de")).toBe("13. Mai 2025");
    expect(formatCertificateDate("nope", "hu")).toBe("");
  });
});
