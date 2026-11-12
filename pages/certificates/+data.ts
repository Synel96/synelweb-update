import { DEFAULT_LANG, type SupportedLang } from "@/src/i18n-config";
import { getCertificates } from "@/src/services/certificatesService";
import type { AppLang } from "@/src/services/serviceCardsService";

export async function data(pageContext: { lang?: SupportedLang }) {
  const lang = (pageContext.lang ?? DEFAULT_LANG) as AppLang;

  try {
    const certificates = await getCertificates(lang);
    return { certificates, fetchError: false };
  } catch {
    return { certificates: [], fetchError: true };
  }
}
