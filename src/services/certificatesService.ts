import { resolveApiBaseUrl } from "@/src/apiBaseUrl";
import { fetchWithTimeout } from "@/src/fetchWithTimeout";
import type { AppLang } from "./serviceCardsService";

// The blocks of the Certificates page, in order (Certificate.category in the admin).
export const CERTIFICATE_CATEGORIES = ["frontend", "backend", "fullstack", "marketing"] as const;
export type CertificateCategory = (typeof CERTIFICATE_CATEGORIES)[number];

export type CertificateKind = "exam" | "course";

export type Certificate = {
  id: string;
  title: string;
  issuer: string;
  category: CertificateCategory;
  kind: CertificateKind;
  issuedOn: string; // YYYY-MM-DD
  expiresOn: string | null; // YYYY-MM-DD
  isExpired: boolean;
  hours: number | null;
  credentialUrl: string;
  credentialId: string;
  skills: string[];
  badgeImage: string;
  order: number;
};

const CERTIFICATES_ENDPOINT = `${resolveApiBaseUrl()}/api/certificates/`;

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

const LOCALE_BY_LANG: Record<AppLang, string> = { hu: "hu-HU", en: "en-US", de: "de-DE" };

const text = (value: unknown) => (typeof value === "string" ? value.trim() : "");

const isoDate = (value: unknown) => {
  const s = text(value);
  return ISO_DATE.test(s) ? s : "";
};

// Only absolute http(s) links are used as hrefs.
const safeUrl = (value: unknown) => {
  const s = text(value);
  return /^https?:\/\//i.test(s) ? s : "";
};

export function normalizeCertificate(raw: unknown): Certificate | null {
  if (!raw || typeof raw !== "object") return null;
  const item = raw as Record<string, unknown>;
  const title = text(item.title);
  const issuedOn = isoDate(item.issuedOn);
  const category = item.category as CertificateCategory;
  if (!title || !issuedOn || !CERTIFICATE_CATEGORIES.includes(category)) return null;

  const expiresOn = isoDate(item.expiresOn) || null;
  const hours = typeof item.hours === "number" && item.hours > 0 ? item.hours : null;
  return {
    id: String(item.id ?? title),
    title,
    issuer: text(item.issuer),
    category,
    kind: item.kind === "course" ? "course" : "exam",
    issuedOn,
    expiresOn,
    isExpired: item.isExpired === true,
    hours,
    credentialUrl: safeUrl(item.credentialUrl),
    credentialId: text(item.credentialId),
    skills: Array.isArray(item.skills) ? item.skills.map(text).filter(Boolean) : [],
    badgeImage: safeUrl(item.badgeImage),
    order: typeof item.order === "number" ? item.order : 0,
  };
}

export async function getCertificates(lang: AppLang): Promise<Certificate[]> {
  const response = await fetchWithTimeout(CERTIFICATES_ENDPOINT, {
    headers: { "Accept-Language": lang },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch certificates.");
  }
  const data = (await response.json()) as unknown;
  if (!Array.isArray(data)) return [];
  // The backend already orders them (category, order, newest first).
  return data.map(normalizeCertificate).filter((c): c is Certificate => c !== null);
}

// "2025. május 13." / "May 13, 2025" / "13. Mai 2025". Parsed as a calendar
// date (no time zone), so it never shifts a day.
export function formatCertificateDate(iso: string, lang: AppLang): string {
  if (!ISO_DATE.test(iso)) return "";
  const [y, m, d] = iso.split("-").map(Number);
  return new Intl.DateTimeFormat(LOCALE_BY_LANG[lang] ?? LOCALE_BY_LANG.hu, {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(y, m - 1, d)));
}
