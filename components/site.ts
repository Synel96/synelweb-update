import { env } from "@/src/env";
import type { SupportedLang } from "@/src/i18n-config";

export const BRAND_NAME = env.VITE_BRAND_NAME;
export const SITE_URL = env.VITE_SITE_URL;

export const NAV_LINKS = [
  { href: "/", labelKey: "nav.home" },
  { href: "/services", labelKey: "nav.services" },
  { href: "/projects", labelKey: "nav.projects" },
  { href: "/blog", labelKey: "nav.blog" },
  { href: "/technology", labelKey: "nav.technology" },
  {
    href: "/contact",
    labelKey: "nav.contact",
    fallbackLabel: {
      en: "Contact",
      hu: "Kapcsolat",
      de: "Kontakt",
    } satisfies Record<SupportedLang, string>,
  },
  { href: "/about", labelKey: "nav.about" },
] as const;
