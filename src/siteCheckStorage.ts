import type { SiteCheckResult } from "@/src/services/siteCheckService";

// The last website check, kept for this browser tab so the quote form can
// offer to attach it. sessionStorage: gone when the tab closes.
const KEY = "synelweb:site-check";
const MAX_AGE_MS = 24 * 60 * 60 * 1000;

export type StoredSiteCheck = { result: SiteCheckResult; checkedAt: string };

export function storeSiteCheck(result: SiteCheckResult) {
  try {
    const value: StoredSiteCheck = { result, checkedAt: new Date().toISOString() };
    sessionStorage.setItem(KEY, JSON.stringify(value));
  } catch {
    // Private mode or storage off: attaching just isn't offered.
  }
}

export function readStoredSiteCheck(): StoredSiteCheck | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    const value = JSON.parse(raw) as StoredSiteCheck;
    if (!value?.result?.url || !value.checkedAt) return null;
    if (Date.now() - Date.parse(value.checkedAt) > MAX_AGE_MS) return null;
    return value;
  } catch {
    return null;
  }
}

// What goes to the backend with a quote request: the essentials only.
export function siteCheckAttachment({ result, checkedAt }: StoredSiteCheck) {
  return {
    url: result.url,
    finalUrl: result.finalUrl,
    strategy: result.strategy,
    checkedAt,
    scores: result.scores,
    lab: result.lab.map(({ title, value }) => ({ title, value })),
    field: result.field.map(({ id, percentile, category }) => ({ id, percentile, category })),
    opportunities: result.opportunities.map(({ title, savingsMs, clsSavings }) => ({
      title,
      savingsMs,
      clsSavings: clsSavings ?? 0,
    })),
  };
}
