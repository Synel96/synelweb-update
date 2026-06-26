// components/LanguageSwitcher.tsx
// Switches language by navigating to the same logical path under the new
// lang prefix, e.g. /en/about → /hu/about.
// The URL is the single source of truth — no localStorage involved.

import { navigate } from "vike/client/router";
import { usePageContext } from "vike-react/usePageContext";
import { SUPPORTED_LANGS, DEFAULT_LANG, type SupportedLang } from "@/src/i18n-config";
import { Button } from "@/components/ui/button";

const LABELS: Record<SupportedLang, string> = {
  en: "EN",
  hu: "HU",
  de: "DE",
};

export function LanguageSwitcher() {
  const pageContext = usePageContext() as { lang?: SupportedLang; urlPathname: string };
  const currentLang = pageContext.lang ?? DEFAULT_LANG;
  // urlPathname is the logical path without the lang prefix (set by onBeforeRoute)
  const logicalPath = pageContext.urlPathname;

  const switchTo = (lang: SupportedLang) => {
    const target = logicalPath === "/" ? `/${lang}/` : `/${lang}${logicalPath}`;
    navigate(target);
  };

  return (
    <div className="flex items-center gap-1" aria-label="Language switcher">
      {SUPPORTED_LANGS.map((lang) => (
        <Button
          key={lang}
          variant="ghost"
          size="sm"
          onClick={() => switchTo(lang)}
          aria-pressed={currentLang === lang}
          aria-label={`Switch to ${lang.toUpperCase()}`}
          className={
            currentLang === lang
              ? "font-semibold text-(--brand-on-surface)"
              : "text-white/60 hover:text-(--brand-on-surface)"
          }
        >
          {LABELS[lang]}
        </Button>
      ))}
    </div>
  );
}
