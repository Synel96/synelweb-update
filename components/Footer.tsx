import { useTranslation } from "react-i18next";
import { usePageContext } from "vike-react/usePageContext";
import { BRAND_NAME, NAV_LINKS, visibleSubLinks } from "./site";
import { DEFAULT_LANG, type SupportedLang } from "@/src/i18n-config";
import { localizePath } from "@/src/localizedRoutes";

type FooterProps = {
  brandName?: string;
};

export function Footer({ brandName = BRAND_NAME }: FooterProps) {
  const year = new Date().getFullYear();
  const { t } = useTranslation();
  const pageContext = usePageContext() as { lang?: SupportedLang };
  const lang = pageContext.lang ?? DEFAULT_LANG;

  const langHref = (href: string) => localizePath(href, lang);
  const navLabel = (item: (typeof NAV_LINKS)[number]) =>
    t(item.labelKey, {
      defaultValue: item.fallbackLabel?.[lang] ?? item.labelKey,
    });
  const visibleNavLinks = NAV_LINKS.filter((item) => !item.hiddenInLangs?.includes(lang));

  return (
    <footer className="bg-(--brand-surface) text-(--brand-on-surface)">
      <div className="fancy-divider" aria-hidden="true" />
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-4 px-6 pt-8 pb-24 text-sm text-white/80 lg:pb-8">
        <a
          href={langHref("/")}
          className="brand-tech bg-linear-to-r from-(--color-secondary-warm) to-(--color-accent) bg-clip-text text-base text-transparent"
        >
          {brandName}
        </a>
        <nav aria-label="Footer links" className="flex flex-wrap items-center justify-center gap-4">
          {visibleNavLinks.map((item) => (
            <a
              key={item.href}
              href={langHref(item.href)}
              className="text-white/75 transition-colors hover:text-(--accent)"
            >
              {navLabel(item)}
            </a>
          ))}
          {visibleNavLinks.flatMap((item) =>
            visibleSubLinks(item, lang)
              .filter((sub) => sub.href !== item.href)
              .map((sub) => (
                <a
                  key={sub.href}
                  href={langHref(sub.href)}
                  className="text-white/75 transition-colors hover:text-(--accent)"
                >
                  {sub.label}
                </a>
              ))
          )}
        </nav>
        <nav
          aria-label="Legal links"
          className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-white/55"
        >
          <a
            href="/adatkezeles"
            className="underline decoration-white/20 underline-offset-4 transition-colors hover:text-(--accent) hover:decoration-(--accent)"
          >
            Adatkezelési tájékoztató
          </a>
          <a
            href="/impresszum"
            className="underline decoration-white/20 underline-offset-4 transition-colors hover:text-(--accent) hover:decoration-(--accent)"
          >
            Impresszum
          </a>
          <a
            href="/aszf"
            className="underline decoration-white/20 underline-offset-4 transition-colors hover:text-(--accent) hover:decoration-(--accent)"
          >
            ÁSZF
          </a>
        </nav>
        <span className="text-xs text-white/45">
          {year} {brandName}. {t("footer.allRightsReserved")}
        </span>
      </div>
    </footer>
  );
}
