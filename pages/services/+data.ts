import { DEFAULT_LANG, type SupportedLang } from "@/src/i18n-config";
import { localizePath } from "@/src/localizedRoutes";
import { getServiceCards, type AppLang } from "@/src/services/serviceCardsService";
import { getCertificates } from "@/src/services/certificatesService";

export async function data(pageContext: { lang?: SupportedLang }) {
  const lang = (pageContext.lang ?? DEFAULT_LANG) as AppLang;
  const contactHref = localizePath("/contact", lang);

  // Only used to show which certificates back a service; never fails the page.
  const certificates = await getCertificates(lang).catch(() => []);

  try {
    const cards = await getServiceCards(lang);
    return {
      cards,
      fetchError: false,
      contactHref,
      certificates,
    };
  } catch {
    return {
      cards: [],
      fetchError: true,
      contactHref,
      certificates,
    };
  }
}
