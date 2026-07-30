// A dedicated i18next instance for component tests, loaded with the real
// locale bundles (not the app's src/i18n.ts singleton, which has SSR/HTTP
// bootstrapping side effects unsuited to unit tests). Using the real JSON
// files means a test fails loudly if a component references a translation
// key that doesn't actually exist in the shipped locale files.
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import hu from "../public/locales/hu/common.json";
import en from "../public/locales/en/common.json";
import de from "../public/locales/de/common.json";
import { DEFAULT_LANG, SUPPORTED_LANGS, type SupportedLang } from "../src/i18n-config";

let initialized = false;

export async function getTestI18n(lang: SupportedLang = DEFAULT_LANG) {
  if (!initialized) {
    await i18n.use(initReactI18next).init({
      resources: {
        hu: { common: hu },
        en: { common: en },
        de: { common: de },
      },
      lng: lang,
      fallbackLng: DEFAULT_LANG,
      supportedLngs: SUPPORTED_LANGS,
      defaultNS: "common",
      ns: ["common"],
      react: { useSuspense: false },
      interpolation: { escapeValue: false },
    });
    initialized = true;
  } else if (i18n.language !== lang) {
    await i18n.changeLanguage(lang);
  }

  return i18n;
}
