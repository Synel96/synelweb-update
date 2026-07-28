import { DEFAULT_LANG, type SupportedLang } from "@/src/i18n-config";
import { localizePath } from "@/src/localizedRoutes";
import { getServiceCards, type AppLang } from "@/src/services/serviceCardsService";

export async function data(pageContext: { lang?: SupportedLang }) {
  const lang = (pageContext.lang ?? DEFAULT_LANG) as AppLang;
  const contactHref = localizePath("/contact", lang);

  try {
    const cards = await getServiceCards(lang);
    return {
      cards,
      fetchError: false,
      contactHref,
    };
  } catch {
    return {
      cards: [],
      fetchError: true,
      contactHref,
    };
  }
}
