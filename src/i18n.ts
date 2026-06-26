// src/i18n.ts
// Initializes i18next with in-bundle translations.
// Language is determined exclusively by the URL prefix (/en/, /hu/, …) via
// Vike's onBeforeRoute hook — NOT by browser detection.
// To add a language: extend SUPPORTED_LANGS in i18n-config.ts, add a JSON
// file under /public/locales/{lang}/common.json, and add it to RESOURCES.

import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enCommon from "../public/locales/en/common.json";
import huCommon from "../public/locales/hu/common.json";
import deCommon from "../public/locales/de/common.json";

import { SUPPORTED_LANGS, DEFAULT_LANG, type SupportedLang } from "./i18n-config";
// Re-export so components can import everything from one place
export { SUPPORTED_LANGS, DEFAULT_LANG, type SupportedLang };

const RESOURCES: Record<SupportedLang, { common: typeof enCommon }> = {
  en: { common: enCommon },
  hu: { common: huCommon },
  de: { common: deCommon },
};

function getInitialClientLang(): SupportedLang {
  if (typeof window === "undefined") return DEFAULT_LANG;

  const [firstSegment] = window.location.pathname.split("/").filter(Boolean);
  const maybeLang = firstSegment as SupportedLang | undefined;

  return maybeLang && SUPPORTED_LANGS.includes(maybeLang) ? maybeLang : DEFAULT_LANG;
}

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources: RESOURCES,
    // On client, initialize from URL language prefix to keep hydration in sync.
    lng: getInitialClientLang(),
    fallbackLng: DEFAULT_LANG,
    supportedLngs: SUPPORTED_LANGS,
    defaultNS: "common",
    ns: ["common"],
    initImmediate: false,
    react: { useSuspense: false },
    interpolation: { escapeValue: false },
  });
}

export default i18n;
