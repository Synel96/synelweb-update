// components/LanguageSwitcher.tsx
// Renders a compact button group to switch between supported languages.
// Persists selection in localStorage (via i18next LanguageDetector).

import { useTranslation } from "react-i18next";
import { SUPPORTED_LANGS, type SupportedLang } from "@/src/i18n";
import { Button } from "@/components/ui/button";

const LABELS: Record<SupportedLang, string> = {
  en: "EN",
  hu: "HU",
};

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const currentLang = i18n.resolvedLanguage as SupportedLang;

  return (
    <div className="flex items-center gap-1" aria-label="Language switcher">
      {SUPPORTED_LANGS.map((lang) => (
        <Button
          key={lang}
          variant="ghost"
          size="sm"
          onClick={() => i18n.changeLanguage(lang)}
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
