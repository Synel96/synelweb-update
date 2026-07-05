// src/i18n.ts
// Initializes i18next with per-language lazy-loaded translations.
// Language is determined exclusively by the URL prefix (/en/, /hu/, …) via
// Vike's onBeforeRoute hook — NOT by browser detection.
// To add a language: extend SUPPORTED_LANGS in i18n-config.ts and add a JSON
// file under /public/locales/{lang}/common.json.

import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import { SUPPORTED_LANGS, DEFAULT_LANG, type SupportedLang } from "./i18n-config";
// Re-export so components can import everything from one place
export { SUPPORTED_LANGS, DEFAULT_LANG, type SupportedLang };

type CommonMessages = Record<string, unknown>;

function getInitialClientLang(): SupportedLang {
  if (typeof window === "undefined") return DEFAULT_LANG;

  const [firstSegment] = window.location.pathname.split("/").filter(Boolean);
  const maybeLang = firstSegment as SupportedLang | undefined;

  return maybeLang && SUPPORTED_LANGS.includes(maybeLang) ? maybeLang : DEFAULT_LANG;
}

async function loadCommonMessages(lang: SupportedLang): Promise<CommonMessages> {
  switch (lang) {
    case "hu": {
      const mod = await import("../public/locales/hu/common.json");
      return mod.default as CommonMessages;
    }
    case "de": {
      const mod = await import("../public/locales/de/common.json");
      return mod.default as CommonMessages;
    }
    case "en":
    default: {
      const mod = await import("../public/locales/en/common.json");
      return mod.default as CommonMessages;
    }
  }
}

async function loadInitialResources() {
  if (typeof window === "undefined") {
    const [en, hu, de] = await Promise.all([
      loadCommonMessages("en"),
      loadCommonMessages("hu"),
      loadCommonMessages("de"),
    ]);

    return {
      en: { common: en },
      hu: { common: hu },
      de: { common: de },
    };
  }

  const lang = getInitialClientLang();
  const common = await loadCommonMessages(lang);
  return {
    [lang]: { common },
  };
}

export async function ensureLanguageResources(lang: SupportedLang) {
  if (i18n.hasResourceBundle(lang, "common")) return;

  const common = await loadCommonMessages(lang);
  i18n.addResourceBundle(lang, "common", common, true, true);
}

const initialResources = await loadInitialResources();

if (!i18n.isInitialized) {
  await i18n.use(initReactI18next).init({
    resources: initialResources,
    // On client, initialize from URL language prefix to keep hydration in sync.
    lng: getInitialClientLang(),
    fallbackLng: DEFAULT_LANG,
    supportedLngs: SUPPORTED_LANGS,
    partialBundledLanguages: true,
    defaultNS: "common",
    ns: ["common"],
    initImmediate: false,
    react: { useSuspense: false },
    interpolation: { escapeValue: false },
  });
}

export default i18n;
