import { env } from "@/src/env";
import type { SupportedLang } from "@/src/i18n-config";

export const BRAND_NAME = env.VITE_BRAND_NAME;
export const SITE_URL = env.VITE_SITE_URL;

// A submenu entry, shown only in the languages it has a label for (the
// regional pages each exist in one language).
type NavSubLink = {
  href: string;
  label: Partial<Record<SupportedLang, string>>;
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
      { href: "/services", label: { hu: "Összes szolgáltatás", de: "Alle Leistungen" } },
      { href: "/sopron", label: { hu: "Sopron és környéke" } },
      { href: "/austria", label: { de: "Burgenland & Wien" } },
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
// the link's own page to offer (e.g. English has no regional pages).
export function visibleSubLinks(
  item: NavLink,
  lang: SupportedLang
): Array<{ href: string; label: string }> {
  const links = (item.subLinks ?? [])
    .filter((sub) => sub.label[lang])
    .map((sub) => ({ href: sub.href, label: sub.label[lang] as string }));
  return links.some((link) => link.href !== item.href) ? links : [];
}
