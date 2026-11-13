import { DEFAULT_LANG, type SupportedLang } from "@/src/i18n-config";
import { getCertificates } from "@/src/services/certificatesService";
import { getServiceCards, type AppLang } from "@/src/services/serviceCardsService";

// The marketing services (the ads setup + management) and the certificates
// behind them. A backend hiccup at build time leaves a list empty; the page
// refetches both in the browser.
export async function data(pageContext: { lang?: SupportedLang }) {
  const lang = (pageContext.lang ?? DEFAULT_LANG) as AppLang;
  const [cards, certificates] = await Promise.all([
    getServiceCards(lang).catch(() => []),
    getCertificates(lang).catch(() => []),
  ]);
  return {
    cards: cards.filter((card) => card.category === "marketing"),
    certificates,
  };
}
