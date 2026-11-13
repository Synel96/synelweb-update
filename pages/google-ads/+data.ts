import { DEFAULT_LANG, type SupportedLang } from "@/src/i18n-config";
import { getCertificates } from "@/src/services/certificatesService";
import type { AppLang } from "@/src/services/serviceCardsService";

// The certificates behind the ads service (the price itself is in code). A
// backend hiccup at build time leaves the list empty; the page refetches it.
export async function data(pageContext: { lang?: SupportedLang }) {
  const lang = (pageContext.lang ?? DEFAULT_LANG) as AppLang;
  return { certificates: await getCertificates(lang).catch(() => []) };
}
