import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithI18n } from "../test/render";
import { CertificateCard, issuerInitials } from "./CertificateCard";
import type { Certificate } from "@/src/services/certificatesService";

const EXAM: Certificate = {
  id: "1",
  title: "Google Ads Search Certification",
  issuer: "Google Skillshop",
  category: "marketing",
  kind: "exam",
  issuedOn: "2026-11-08",
  expiresOn: "2027-11-08",
  isExpired: false,
  hours: null,
  credentialUrl: "https://skillshop.credential.net/abc",
  credentialId: "199772599",
  skills: ["Google Ads", "Keywords"],
  badgeImage: "",
  order: 0,
};

const COURSE: Certificate = {
  ...EXAM,
  id: "2",
  title: "Become a Full-Stack Developer",
  issuer: "Udemy · Marek Adamovič",
  category: "fullstack",
  kind: "course",
  issuedOn: "2025-07-08",
  expiresOn: null,
  hours: 7.5,
  credentialUrl: "https://ude.my/UC-x",
};

describe("issuerInitials", () => {
  it("takes initials from the issuer's name", () => {
    expect(issuerInitials("Google Skillshop")).toBe("GS");
    expect(issuerInitials("Python Institute (OpenEDG)")).toBe("PI");
    expect(issuerInitials("Udemy · Marek Adamovič")).toBe("UD");
  });
});

describe("CertificateCard", () => {
  it("shows an exam with its issue date, validity, skills and verification link", async () => {
    await renderWithI18n(<CertificateCard certificate={EXAM} lang="hu" />, "hu");

    expect(screen.getByRole("heading", { name: EXAM.title })).toBeInTheDocument();
    expect(screen.getByText("Google Skillshop · 2026. november 8.")).toBeInTheDocument();
    expect(screen.getByText("Vizsga")).toBeInTheDocument();
    expect(screen.getByText("Érvényes: 2027. november 8-ig")).toBeInTheDocument();
    expect(screen.getByText("Ellenőrizhető")).toBeInTheDocument();
    expect(screen.getByText("Google Ads")).toBeInTheDocument();
    const link = screen.getByRole("link", { name: /Tanúsítvány megtekintése/ });
    expect(link).toHaveAttribute("href", EXAM.credentialUrl);
    expect(link).toHaveAttribute("target", "_blank");
    expect(screen.getByText("GS")).toBeInTheDocument();
  });

  it("labels a course with its length and no validity line", async () => {
    await renderWithI18n(<CertificateCard certificate={COURSE} lang="hu" />, "hu");

    expect(screen.getByText("Kurzus · 7,5 óra")).toBeInTheDocument();
    expect(screen.queryByText(/Érvényes/)).not.toBeInTheDocument();
  });

  it("marks an expired certificate", async () => {
    await renderWithI18n(
      <CertificateCard certificate={{ ...EXAM, isExpired: true }} lang="hu" />,
      "hu"
    );

    expect(screen.getByText("Lejárt")).toBeInTheDocument();
    expect(screen.queryByText(/Érvényes/)).not.toBeInTheDocument();
  });

  it("has no link or verified badge without a verification URL, and shows a badge image if set", async () => {
    await renderWithI18n(
      <CertificateCard
        certificate={{ ...EXAM, credentialUrl: "", badgeImage: "https://img.example/badge.png" }}
        lang="hu"
      />,
      "hu"
    );

    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(screen.queryByText("Ellenőrizhető")).not.toBeInTheDocument();
    expect(screen.queryByText("GS")).not.toBeInTheDocument();
    expect(document.querySelector("img")).toHaveAttribute("src", "https://img.example/badge.png");
  });
});
