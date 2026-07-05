// components/LanguageSwitcher.tsx
// Switches language by navigating to the same logical path under the new
// lang prefix, e.g. /en/about → /hu/about.
// The URL is the single source of truth — no localStorage involved.

import { navigate } from "vike/client/router";
import { usePageContext } from "vike-react/usePageContext";
import { SUPPORTED_LANGS, DEFAULT_LANG, type SupportedLang } from "@/src/i18n-config";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuTriggerIcon,
} from "@/components/ui/dropdown-menu";

const LABELS: Record<SupportedLang, string> = {
  en: "EN",
  hu: "HU",
  de: "DE",
};

const SCROLL_RESTORE_KEY = "synelweb:preserve-scroll-y";

export function LanguageSwitcher() {
  const pageContext = usePageContext() as { lang?: SupportedLang; urlPathname: string };
  const currentLang = pageContext.lang ?? DEFAULT_LANG;
  // urlPathname is the logical path without the lang prefix (set by onBeforeRoute)
  const logicalPath = pageContext.urlPathname;

  const switchTo = (lang: SupportedLang) => {
    const target = logicalPath === "/" ? `/${lang}/` : `/${lang}${logicalPath}`;
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
    const target = logicalPath === "/" ? `/${lang}/` : `/${lang}${logicalPath}`;
    sessionStorage.setItem(SCROLL_RESTORE_KEY, String(window.scrollY));
    navigate(target);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          aria-label="Switch language"
          className="h-9 rounded-xl px-3 text-white/85 hover:bg-white/10 hover:text-(--brand-on-surface)"
        >
          <span className="text-xs font-semibold tracking-[0.16em]">{LABELS[currentLang]}</span>
          <DropdownMenuTriggerIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Language</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={currentLang}
          onValueChange={(value) => switchTo(value as SupportedLang)}
        >
          {SUPPORTED_LANGS.map((lang) => (
            <DropdownMenuRadioItem key={lang} value={lang}>
              {LABELS[lang]}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
