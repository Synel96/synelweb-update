// components/I18nProvider.tsx
// Initializes i18next (browser-only) and wraps children with react-i18next context.
// Also syncs <html lang="..."> with the active language for accessibility/SEO.

import { type ReactNode, useEffect } from "react";
import { I18nextProvider } from "react-i18next";
import i18n from "@/src/i18n";

export function I18nProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const syncLang = (lng: string) => {
      document.documentElement.lang = lng.split("-")[0]; // e.g. "en-US" → "en"
    };

    // Set on mount
    if (i18n.resolvedLanguage) syncLang(i18n.resolvedLanguage);

    // Keep in sync on language change
    i18n.on("languageChanged", syncLang);
    return () => i18n.off("languageChanged", syncLang);
  }, []);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
