import { useTranslation } from "react-i18next";
import { usePageContext } from "vike-react/usePageContext";
import { BRAND_NAME, NAV_LINKS } from "./site";
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
    <footer className="border-t border-white/10 bg-(--brand-surface) text-(--brand-on-surface)">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-3 px-6 py-4 text-sm text-white/80">
        <nav aria-label="Footer links" className="flex flex-wrap items-center justify-center gap-4">
          {visibleNavLinks.map((item) => (
            <a
              key={item.href}
              href={langHref(item.href)}
              className="text-white/85 transition-colors hover:text-white"
            >
              {navLabel(item)}
            </a>
          ))}
        </nav>
        <span>
          {year} {brandName}. {t("footer.allRightsReserved")}
        </span>
      </div>
    </footer>
  );
}
