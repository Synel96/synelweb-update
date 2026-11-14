import { env } from "@/src/env";
import type { SupportedLang } from "@/src/i18n-config";

export const BRAND_NAME = env.VITE_BRAND_NAME;
export const SITE_URL = env.VITE_SITE_URL;

// A submenu entry, shown only in the languages it has a label for (the
// regional pages each exist in one language).
type NavSubLink = {
  href: string;
  label: Partial<Record<SupportedLang, string>>;
  // Left out of the header menu (desktop dropdown and mobile drawer) but
  // still linked from the footer, so search engines keep finding it.
  footerOnly?: boolean;
};

type NavLink = {
  href: string;
  labelKey: string;
  hiddenInLangs?: readonly SupportedLang[];
  // Left out of the desktop link row (it only has room for seven); still in
  // the mobile menu and the footer.
  hiddenInDesktopNav?: boolean;
  fallbackLabel?: Record<SupportedLang, string>;
  subLinks?: readonly NavSubLink[];
};

export const NAV_LINKS: readonly NavLink[] = [
  { href: "/", labelKey: "nav.home" },
  {
    href: "/services",
    labelKey: "nav.services",
    subLinks: [
      {
        href: "/services",
        label: { hu: "Összes szolgáltatás", en: "All services", de: "Alle Leistungen" },
      },
      {
        href: "/google-ads",
        label: {
          hu: "Google Ads kezelés",
          en: "Google Ads management",
          de: "Google Ads Betreuung",
        },
      },
      // Regional landing pages are for search visitors, not for browsing.
      { href: "/sopron", label: { hu: "Sopron és környéke" }, footerOnly: true },
      { href: "/austria", label: { de: "Burgenland & Wien" }, footerOnly: true },
    ],
  },
  { href: "/projects", labelKey: "nav.projects" },
  { href: "/certificates", labelKey: "nav.certificates", hiddenInDesktopNav: true },
  {
    href: "/blog",
    labelKey: "nav.blog",
    hiddenInLangs: ["en", "de"],
    fallbackLabel: {
      en: "Blog",
      hu: "Blog",
      de: "Blog",
    },
  },
  { href: "/technology", labelKey: "nav.technology" },
  {
    href: "/contact",
    labelKey: "nav.contact",
    fallbackLabel: {
      en: "Contact",
      hu: "Kapcsolat",
      de: "Kontakt",
    },
  },
  { href: "/about", labelKey: "nav.about" },
];

// The submenu of a nav link in one language: empty unless there is more than
// the link's own page to offer. The header menu leaves out footer-only
// entries; the footer (and the active-link check) passes includeFooterOnly.
export function visibleSubLinks(
  item: NavLink,
  lang: SupportedLang,
  { includeFooterOnly = false }: { includeFooterOnly?: boolean } = {}
): Array<{ href: string; label: string }> {
  const links = (item.subLinks ?? [])
    .filter((sub) => sub.label[lang] && (includeFooterOnly || !sub.footerOnly))
    .map((sub) => ({ href: sub.href, label: sub.label[lang] as string }));
  return links.some((link) => link.href !== item.href) ? links : [];
}
