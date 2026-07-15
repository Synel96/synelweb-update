import { MenuIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { usePageContext } from "vike-react/usePageContext";
import { Button } from "@/components/ui/button";
import { useMounted } from "@/src/hooks/use-mounted";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { BRAND_NAME, NAV_LINKS } from "./site";
import { LanguageSwitcher, LanguageSwitcherDropdown } from "./LanguageSwitcher";
import { DEFAULT_LANG, type SupportedLang } from "@/src/i18n-config";
import { localizePath } from "@/src/localizedRoutes";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const mounted = useMounted();
  const pageContext = usePageContext() as { urlPathname: string; lang?: SupportedLang };
  const { urlPathname } = pageContext;
  const isHome = urlPathname === "/";
  const lang = pageContext.lang ?? DEFAULT_LANG;
  const { t } = useTranslation();

  useEffect(() => {
    if (!isHome) return;

    const updateScrollProgress = () => {
      const nextProgress = Math.min(window.scrollY / 180, 1);
      setScrollProgress(nextProgress);
    };

    updateScrollProgress();
    window.addEventListener("scroll", updateScrollProgress, { passive: true });
    return () => window.removeEventListener("scroll", updateScrollProgress);
  }, [isHome]);

  // Build a URL with the current lang prefix
  const langHref = (href: string) => localizePath(href, lang);

  const isActive = (href: string) =>
    href === "/" ? urlPathname === href : urlPathname.startsWith(href);

  const navLinkClass = (href: string) =>
    isActive(href)
      ? "font-medium text-(--brand-on-surface)"
      : "text-white/70 transition-colors hover:text-(--brand-on-surface)";

  const navLabel = (item: (typeof NAV_LINKS)[number]) =>
    t(item.labelKey, {
      defaultValue: item.fallbackLabel?.[lang] ?? item.labelKey,
    });

  const headerProgress = isHome ? scrollProgress : 1;
  const headerAlpha = 0.9 * headerProgress;
  const headerStyle = {
    backgroundColor: `rgba(11, 15, 25, ${headerAlpha})`,
    borderBottomColor: `rgba(255, 255, 255, ${0.1 * headerProgress})`,
    boxShadow: `0 14px 40px -24px rgba(0, 0, 0, ${0.5 * headerProgress})`,
    backdropFilter: `blur(${6 + 10 * headerProgress}px)`,
  } as React.CSSProperties;

  return (
    <header
      style={headerStyle}
      className={`fixed top-0 right-0 left-0 z-50 border-b text-(--brand-on-surface) supports-backdrop-filter:bg-[color-mix(in_oklch,var(--brand-surface),transparent_5%)] ${
        isHome ? "transition-colors duration-200" : ""
      }`}
    >
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
        <a
          href={langHref("/")}
          className="brand-tech group relative isolate inline-flex items-center text-base font-semibold"
          aria-label={BRAND_NAME}
          title={BRAND_NAME}
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -inset-x-2 -inset-y-1 hidden rounded-md bg-black/22 opacity-85 blur-[1.4px] transition-opacity duration-300 group-hover:opacity-100 lg:block lg:bg-black/30 lg:opacity-95"
          />
          <span className="relative z-10 bg-[linear-gradient(120deg,var(--color-secondary-warm),var(--color-secondary-hot)_62%,var(--color-secondary-warm))] bg-clip-text text-lg leading-none font-semibold tracking-[0.14em] text-transparent drop-shadow-[0_0_10px_color-mix(in_oklab,var(--color-secondary-hot),transparent_60%)] transition-all duration-300 group-hover:brightness-110">
            {BRAND_NAME}
          </span>
        </a>

        <nav className="hidden items-center gap-6 lg:flex">
          {NAV_LINKS.map((item) => (
            <a key={item.href} href={langHref(item.href)} className={navLinkClass(item.href)}>
              {navLabel(item)}
            </a>
          ))}
        </nav>

        <div className="hidden items-center lg:flex">
          <LanguageSwitcherDropdown />
        </div>

        <div className="lg:hidden">
          {mounted ? (
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={t("nav.openMenu")}
                  onClick={() => setOpen(true)}
                  className="text-(--brand-on-surface) hover:bg-white/10 hover:text-(--brand-on-surface)"
                >
                  <span className="relative size-5">
                    <MenuIcon
                      className={`absolute inset-0 size-5 transition-all duration-300 ${
                        open ? "scale-0 rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100"
                      }`}
                    />
                    <XIcon
                      className={`absolute inset-0 size-5 transition-all duration-300 ${
                        open ? "scale-100 rotate-0 opacity-100" : "scale-0 -rotate-90 opacity-0"
                      }`}
                    />
                  </span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[min(20rem,100vw)] max-w-[100vw] border-l-white/10 bg-(--brand-surface) text-(--brand-on-surface)"
              >
                <nav className="mt-2 flex flex-col gap-1 px-4 pb-6">
                  {NAV_LINKS.map((item) => (
                    <SheetClose asChild key={item.href}>
                      <a
                        href={langHref(item.href)}
                        onClick={() => setOpen(false)}
                        className={`rounded-md px-3 py-2 text-sm ${
                          isActive(item.href)
                            ? "bg-white/15 font-medium text-(--brand-on-surface)"
                            : "text-white/75 hover:bg-white/10 hover:text-(--brand-on-surface)"
                        }`}
                      >
                        {navLabel(item)}
                      </a>
                    </SheetClose>
                  ))}
                </nav>

                <div className="border-t border-white/10 px-4 pt-4 pb-6">
                  <LanguageSwitcher />
                </div>
              </SheetContent>
            </Sheet>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              aria-label={t("nav.openMenu")}
              disabled
              className="text-(--brand-on-surface) hover:bg-white/10 hover:text-(--brand-on-surface)"
            >
              <MenuIcon className="size-5" />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
