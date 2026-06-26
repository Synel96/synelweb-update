// components/I18nProvider.tsx
// Reads pageContext.lang (set by onBeforeRoute from the URL prefix) and
// applies it to i18next.
// Server render uses a per-request cloned i18n instance to avoid cross-request
// singleton races, while client updates happen in an effect.

import { type ReactNode, useEffect } from "react";
import { I18nextProvider } from "react-i18next";
import { usePageContext } from "vike-react/usePageContext";
import i18n from "@/src/i18n";
import { DEFAULT_LANG, type SupportedLang } from "@/src/i18n-config";

export function I18nProvider({ children }: { children: ReactNode }) {
  const pageContext = usePageContext() as { lang?: SupportedLang };
  const lang = pageContext.lang ?? DEFAULT_LANG;
  const isServer = typeof window === "undefined";

  // Server: isolate each render with its own i18n instance and fixed language.
  const i18nInstance = isServer
    ? i18n.cloneInstance({
        lng: lang,
        initImmediate: false,
      })
    : i18n;

  // Client render: defer language update to effect to avoid React warning.
  useEffect(() => {
    if (isServer) return;

    if (i18n.language !== lang) {
      void i18n.changeLanguage(lang);
    }
    document.documentElement.lang = lang;
  }, [isServer, lang]);

  return <I18nextProvider i18n={i18nInstance}>{children}</I18nextProvider>;
}
