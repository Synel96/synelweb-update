import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithI18n } from "../test/render";
import { CertificatesHighlight } from "./CertificatesHighlight";
import type { Certificate } from "@/src/services/certificatesService";

const make = (
  id: number,
  kind: "exam" | "course",
  issuedOn: string,
  url = "https://example.com/" + id
) =>
  ({
    id: String(id),
    title: `Cert ${id}`,
    issuer: "Issuer",
    category: "backend",
    kind,
    issuedOn,
    expiresOn: null,
    isExpired: false,
    hours: null,
    credentialUrl: url,
    credentialId: "",
    skills: [],
    badgeImage: "",
    order: 0,
  }) as unknown as Certificate;

describe("CertificatesHighlight", () => {
  it("shows the three strongest and links to the full page with the total", async () => {
    await renderWithI18n(
      <CertificatesHighlight
        lang="hu"
        certificates={[
          make(1, "course", "2026-11-09"),
          make(2, "exam", "2025-05-13"),
          make(3, "course", "2025-05-26"),
          make(4, "exam", "2026-11-08"),
        ]}
      />
    );

    expect(
      screen.getAllByRole("listitem").map((li) => li.textContent?.match(/Cert \d/)?.[0])
    ).toEqual(["Cert 4", "Cert 2", "Cert 1"]);
    expect(screen.getByRole("link", { name: /Mind a 4 tanúsítvány/ })).toHaveAttribute(
      "href",
      "/hu/tanusitvanyok"
    );
    expect(screen.getByRole("link", { name: /Cert 4/ })).toHaveAttribute(
      "href",
      "https://example.com/4"
    );
  });

  it("renders nothing without certificates", async () => {
    const { container } = await renderWithI18n(
      <CertificatesHighlight lang="hu" certificates={[]} />
    );
    expect(container).toBeEmptyDOMElement();
  });
});
