import { DEFAULT_LANG, type SupportedLang } from "@/src/i18n-config";
import {
  getServiceCards,
  type AppLang,
} from "@/src/services/serviceCardsService";

export async function data(pageContext: { lang?: SupportedLang }) {
  const lang = (pageContext.lang ?? DEFAULT_LANG) as AppLang;

  try {
    const cards = await getServiceCards(lang);
    return {
      cards,
      fetchError: false,
      contactHref: `/${lang}/contact`,
    };
  } catch {
    return {
      cards: [],
      fetchError: true,
      contactHref: `/${lang}/contact`,
    };
  }
}
