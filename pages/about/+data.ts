import { DEFAULT_LANG, type SupportedLang } from "@/src/i18n-config";
import { getCertificates } from "@/src/services/certificatesService";
import type { AppLang } from "@/src/services/serviceCardsService";

export async function data(pageContext: { lang?: SupportedLang }) {
  const lang = (pageContext.lang ?? DEFAULT_LANG) as AppLang;
  try {
    return { certificates: await getCertificates(lang) };
  } catch {
    return { certificates: [] };
  }
}
