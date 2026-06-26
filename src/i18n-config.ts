// src/i18n-config.ts
// Pure constants for i18n — imported by both src/i18n.ts and Vike route hooks.
// No React or browser imports here so it is safe to use in SSR context.

export const SUPPORTED_LANGS = ["en", "hu", "de"] as const;
export type SupportedLang = (typeof SUPPORTED_LANGS)[number];
export const DEFAULT_LANG: SupportedLang = "en";
