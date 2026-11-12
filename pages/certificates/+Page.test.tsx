import { afterEach, describe, expect, it, vi } from "vitest";
import { screen, waitFor, within } from "@testing-library/react";
import { renderWithI18n } from "../../test/render";

const { usePageContext } = vi.hoisted(() => ({ usePageContext: vi.fn() }));
vi.mock("vike-react/usePageContext", () => ({ usePageContext }));

const { getCertificates } = vi.hoisted(() => ({ getCertificates: vi.fn() }));
vi.mock("@/src/services/certificatesService", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/src/services/certificatesService")>();
  return { ...actual, getCertificates };
});

import Page from "./+Page";
import type { Certificate } from "@/src/services/certificatesService";

const cert = (over: Partial<Certificate>): Certificate => ({
  id: "x",
  title: "Cert",
  issuer: "Issuer",
  category: "backend",
  kind: "exam",
  issuedOn: "2025-05-13",
  expiresOn: null,
  isExpired: false,
  hours: null,
  credentialUrl: "https://example.com/verify",
  credentialId: "",
  skills: [],
  badgeImage: "",
  order: 0,
  ...over,
});

const CERTS = [
  cert({ id: "1", title: "PCEP", category: "backend" }),
  cert({ id: "2", title: "Django REST", category: "backend", kind: "course", hours: 5 }),
  cert({ id: "3", title: "Full-Stack", category: "fullstack", kind: "course", hours: 7.5 }),
  cert({ id: "4", title: "Google Ads Search", category: "marketing", expiresOn: "2027-11-08" }),
];

afterEach(() => {
  vi.clearAllMocks();
});

function setup(data: { certificates: Certificate[]; fetchError: boolean }) {
  usePageContext.mockReturnValue({ lang: "hu", data });
  getCertificates.mockResolvedValue(data.certificates);
}

describe("Certificates page", () => {
  it("groups certificates by category and skips empty categories", async () => {
    setup({ certificates: CERTS, fetchError: false });
    await renderWithI18n(<Page />, "hu");

    const sections = screen.getAllByRole("region");
    expect(sections.map((s) => s.id)).toEqual([
      "tanusitvanyok-backend",
      "tanusitvanyok-fullstack",
      "tanusitvanyok-marketing",
    ]);
    expect(within(sections[0]).getAllByRole("article")).toHaveLength(2);
    expect(
      screen.queryByRole("heading", { name: "Frontend webfejlesztés" })
    ).not.toBeInTheDocument();
  });

  it("shows jump links with counts for the categories in use", async () => {
    setup({ certificates: CERTS, fetchError: false });
    await renderWithI18n(<Page />, "hu");

    const nav = screen.getByRole("navigation", { name: "Tanúsítványok" });
    const links = within(nav).getAllByRole("link");
    expect(links.map((l) => l.textContent)).toEqual([
      "Összes4",
      "Backend2",
      "Fullstack1",
      "Search Ads és marketing1",
    ]);
    expect(links[1]).toHaveAttribute("href", "#tanusitvanyok-backend");
  });

  it("shows swipe dots only for categories with more than one certificate", async () => {
    setup({ certificates: CERTS, fetchError: false });
    await renderWithI18n(<Page />, "hu");

    const backend = document.getElementById("tanusitvanyok-backend")!;
    expect(within(backend).getAllByRole("button", { name: /tanúsítványhoz/ })).toHaveLength(2);
    expect(within(backend).getByText("1 / 2")).toBeInTheDocument();
    const fullstack = document.getElementById("tanusitvanyok-fullstack")!;
    expect(within(fullstack).queryByRole("button")).not.toBeInTheDocument();
  });

  it("shows an error when nothing could be loaded", async () => {
    usePageContext.mockReturnValue({ lang: "hu", data: { certificates: [], fetchError: true } });
    getCertificates.mockRejectedValue(new Error("down"));
    await renderWithI18n(<Page />, "hu");

    await waitFor(() => expect(getCertificates).toHaveBeenCalled());
    expect(screen.queryAllByRole("article")).toHaveLength(0);
    expect(screen.queryByRole("region")).not.toBeInTheDocument();
  });

  it("refreshes a stale prerendered list in the browser", async () => {
    usePageContext.mockReturnValue({ lang: "hu", data: { certificates: [], fetchError: true } });
    getCertificates.mockResolvedValue(CERTS);
    await renderWithI18n(<Page />, "hu");

    expect(await screen.findByRole("heading", { name: "Google Ads Search" })).toBeInTheDocument();
  });
});
