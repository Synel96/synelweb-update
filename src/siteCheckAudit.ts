import type { TFunction } from "i18next";
import type { AuditItem, AuditStatus } from "@/src/services/siteCheckService";
import type { AppLang } from "@/src/services/serviceCardsService";

export type AuditGroup = "seo" | "tech";

// Items with their own text for "fail"; the rest say the same as "warn".
const FAIL_TEXT = new Set([
  "title",
  "description",
  "h1",
  "indexable",
  "viewport",
  "https",
  "robots",
  "pageWeight",
  "fonts",
]);

const SEVERITY: Record<AuditStatus, number> = { fail: 0, warn: 1, info: 2, pass: 3 };

// Problems first, keeping the backend's order within a status.
export function sortAuditItems(items: AuditItem[]): AuditItem[] {
  return items
    .map((item, index) => ({ item, index }))
    .sort((a, b) => SEVERITY[a.item.status] - SEVERITY[b.item.status] || a.index - b.index)
    .map(({ item }) => item);
}

function variant(item: AuditItem): string {
  if (item.id === "structuredData") {
    const types = Array.isArray(item.data.types) ? item.data.types : [];
    if (item.status === "fail" || (Number(item.data.invalid) > 0 && types.length === 0)) {
      return "invalid";
    }
    if (types.length === 0) return "missing";
    if (!item.data.hasBusiness) return "noBusiness";
    return Number(item.data.invalid) > 0 ? "invalid" : "pass";
  }
  if (item.status === "fail" && !FAIL_TEXT.has(item.id)) return "warn";
  return item.status;
}

// The label and the explanation of one item, in the page's language; null
// for an item this version of the site has no text for.
export function describeAuditItem(
  group: AuditGroup,
  item: AuditItem,
  t: TFunction,
  lang: AppLang
): { label: string; message: string } | null {
  const base = `siteCheck.audit.${group}.${item.id}`;
  const key = `${base}.${variant(item)}`;
  if (!t(key, { defaultValue: "" })) return null;

  const numberFormat = new Intl.NumberFormat(
    lang === "en" ? "en-US" : lang === "de" ? "de-DE" : "hu-HU"
  );
  const params: Record<string, string> = {};
  for (const [name, value] of Object.entries(item.data)) {
    if (typeof value === "number") params[name] = numberFormat.format(value);
    else if (Array.isArray(value)) params[name] = value.join(", ");
    else if (typeof value === "string") params[name] = value;
  }
  return { label: t(`${base}.label`), message: t(key, params) };
}
