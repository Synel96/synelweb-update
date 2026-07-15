// components/LanguageSwitcher.tsx
// Switches language by navigating to the same logical path under the new
// lang prefix, e.g. /en/about → /hu/about.
// The URL is the single source of truth — no localStorage involved.

import { navigate } from "vike/client/router";
import { usePageContext } from "vike-react/usePageContext";
import { SUPPORTED_LANGS, DEFAULT_LANG, type SupportedLang } from "@/src/i18n-config";
import { localizePath } from "@/src/localizedRoutes";
import { Button } from "@/components/ui/button";

const LABELS: Record<SupportedLang, string> = {
  en: "EN",
  hu: "HU",
  de: "DE",
};

const SCROLL_RESTORE_KEY = "synelweb:preserve-scroll-y";

export function LanguageSwitcher() {
  const pageContext = usePageContext() as { lang?: SupportedLang; urlPathname: string };
  const currentLang = pageContext.lang ?? DEFAULT_LANG;
  const logicalPath = pageContext.urlPathname;

  const switchTo = (lang: SupportedLang) => {
    const target = localizePath(logicalPath, lang);
    sessionStorage.setItem(SCROLL_RESTORE_KEY, String(window.scrollY));
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

export function LanguageSwitcherDropdown() {
  const pageContext = usePageContext() as { lang?: SupportedLang; urlPathname: string };
  const currentLang = pageContext.lang ?? DEFAULT_LANG;
  const logicalPath = pageContext.urlPathname;

  const switchTo = (lang: SupportedLang) => {
    const target = localizePath(logicalPath, lang);
    sessionStorage.setItem(SCROLL_RESTORE_KEY, String(window.scrollY));
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
              ? "h-9 rounded-xl bg-white/12 px-2 font-semibold text-(--brand-on-surface)"
              : "h-9 rounded-xl px-2 text-white/65 hover:bg-white/10 hover:text-(--brand-on-surface)"
          }
        >
          <span className="text-xs font-semibold tracking-[0.12em]">{LABELS[lang]}</span>
        </Button>
      ))}
    </div>
  );
}
