// src/i18n.ts
// Initializes i18next with browser language detection.
// Translations are imported at build time from /public/locales/{lang}/common.json
// Supported languages: en, hu — add entries to RESOURCES to extend.

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import enCommon from "../public/locales/en/common.json";
import huCommon from "../public/locales/hu/common.json";

export const SUPPORTED_LANGS = ["en", "hu"] as const;
export type SupportedLang = (typeof SUPPORTED_LANGS)[number];
export const DEFAULT_LANG: SupportedLang = "en";

const RESOURCES = {
  en: { common: enCommon },
  hu: { common: huCommon },
} satisfies Record<SupportedLang, { common: typeof enCommon }>;

if (!i18n.isInitialized) {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources: RESOURCES,
      fallbackLng: DEFAULT_LANG,
      supportedLngs: SUPPORTED_LANGS,
      defaultNS: "common",
      ns: ["common"],
      interpolation: { escapeValue: false },
      detection: {
        // Persist user language preference; fall back to browser Accept-Language
        order: ["localStorage", "navigator"],
        caches: ["localStorage"],
        lookupLocalStorage: "i18n-lang",
      },
    });
}

export default i18n;
