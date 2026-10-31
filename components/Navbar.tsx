import { MailIcon, PhoneIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { usePageContext } from "vike-react/usePageContext";
import { Button } from "@/components/ui/button";
import { useMounted } from "@/src/hooks/use-mounted";
import {
  PushDrawer,
  PushDrawerClose,
  PushDrawerContent,
  PushDrawerTitle,
  PushDrawerTrigger,
} from "@/components/ui/push-drawer";
import { BRAND_NAME, NAV_LINKS } from "./site";
import { LanguageSwitcher, LanguageSwitcherDropdown } from "./LanguageSwitcher";
import { DEFAULT_LANG, type SupportedLang } from "@/src/i18n-config";
import { localizePath, resolveLanguageAndLogicalPath } from "@/src/localizedRoutes";

function MenuToggleIcon({ open }: { open: boolean }) {
  return (
    <span className="relative flex size-5 flex-col items-center justify-center">
      <span
        className={`absolute h-0.5 w-5 rounded-full bg-current transition-all duration-300 ease-out ${
          open ? "rotate-45" : "-translate-y-[5px]"
        }`}
      />
      <span
        className={`absolute h-0.5 w-5 rounded-full bg-current transition-all duration-300 ease-out ${
          open ? "-rotate-45" : "translate-y-[5px]"
        }`}
      />
    </span>
  );
}

type NavbarProps = {
  // Optional so the navbar still works standalone; the layout passes these
  // in so it can push the rest of the page aside while the drawer is open.
  menuOpen?: boolean;
  onMenuOpenChange?: (open: boolean) => void;
};

export function Navbar({ menuOpen, onMenuOpenChange }: NavbarProps = {}) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const open = menuOpen ?? uncontrolledOpen;
  const setOpen = (next: boolean) => {
    if (menuOpen === undefined) setUncontrolledOpen(next);
    onMenuOpenChange?.(next);
  };
  const [scrollProgress, setScrollProgress] = useState(0);
  const mounted = useMounted();
  const pageContext = usePageContext() as { urlPathname: string; lang?: SupportedLang };
  const { urlPathname } = pageContext;
  const lang = pageContext.lang ?? DEFAULT_LANG;
  const { logicalPath } = resolveLanguageAndLogicalPath(urlPathname);
  const isHome = logicalPath === "/";
  const { t } = useTranslation();

  useEffect(() => {
    // Only the home page has a transparent video hero to fade in over; every
    // other page keeps the navbar fully colored from the top.
    if (!isHome) return;

    const updateScrolledState = () => {
      const heroSection = document.querySelector<HTMLElement>("[data-home-hero]");
      const heroBottom = heroSection
        ? heroSection.offsetTop + heroSection.offsetHeight
        : window.innerHeight;
      const nextProgress = Math.min(1, Math.max(0, window.scrollY / heroBottom));

      setScrollProgress((current) =>
        Math.abs(current - nextProgress) < 0.01 ? current : nextProgress
      );
    };

    updateScrolledState();
    window.addEventListener("scroll", updateScrolledState, { passive: true });
    window.addEventListener("resize", updateScrolledState);
    return () => {
      window.removeEventListener("scroll", updateScrolledState);
      window.removeEventListener("resize", updateScrolledState);
    };
  }, [isHome]);

  // Build a URL with the current lang prefix
  const langHref = (href: string) => localizePath(href, lang);

  const isActive = (href: string) =>
    href === "/" ? logicalPath === href : logicalPath.startsWith(href);

  const navLinkClass = (href: string) =>
    isActive(href)
      ? "font-medium text-(--brand-on-surface)"
      : "text-white/70 transition-colors hover:text-(--brand-on-surface)";

  const navLabel = (item: (typeof NAV_LINKS)[number]) =>
    t(item.labelKey, {
      defaultValue: item.fallbackLabel?.[lang] ?? item.labelKey,
    });

  const visibleNavLinks = NAV_LINKS.filter((item) => !item.hiddenInLangs?.includes(lang));

  const navbarAlpha = isHome ? 0.88 * scrollProgress : 0.88;
  const navbarBorderAlpha = isHome ? 0.14 * scrollProgress : 0.14;
  const navbarShadowAlpha = isHome ? 0.55 * scrollProgress : 0.55;
  const navbarBlur = isHome ? 16 * scrollProgress : 16;

  return (
    <header
      className="fixed top-0 right-0 left-0 z-50 border-b text-(--brand-on-surface) transition-[background-color,border-color,box-shadow,backdrop-filter] duration-150"
      style={{
        borderColor: `rgba(255,255,255,${navbarBorderAlpha})`,
        backgroundColor: `rgba(11,15,25,${navbarAlpha})`,
        boxShadow: `0 14px 40px -24px rgba(0,0,0,${navbarShadowAlpha})`,
        backdropFilter: `blur(${navbarBlur}px)`,
      }}
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
          {visibleNavLinks.map((item) => (
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
            <PushDrawer open={open} onOpenChange={setOpen}>
              <PushDrawerTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={t("nav.openMenu")}
                  className="text-(--brand-on-surface) hover:bg-white/10 hover:text-(--brand-on-surface)"
                >
                  <MenuToggleIcon open={open} />
                </Button>
              </PushDrawerTrigger>
              <PushDrawerContent
                open={open}
                closeLabel={t("nav.closeMenu")}
                aria-describedby={undefined}
                className="border-l-white/10 bg-(--brand-surface) text-(--brand-on-surface)"
              >
                <PushDrawerTitle className="sr-only">{t("nav.navigationMenu")}</PushDrawerTitle>
                <nav className="mt-2 flex flex-col gap-1 px-4 pb-6">
                  {visibleNavLinks.map((item) => (
                    <PushDrawerClose asChild key={item.href}>
                      <a
                        href={langHref(item.href)}
                        className={`rounded-md px-3 py-2 text-sm ${
                          isActive(item.href)
                            ? "bg-white/15 font-medium text-(--brand-on-surface)"
                            : "text-white/75 hover:bg-white/10 hover:text-(--brand-on-surface)"
                        }`}
                      >
                        {navLabel(item)}
                      </a>
                    </PushDrawerClose>
                  ))}
                </nav>

                <div className="border-t border-white/10 px-4 pt-4 pb-4">
                  <LanguageSwitcher />
                </div>

                <div className="flex flex-col gap-2 border-t border-white/10 px-4 pt-4 pb-6">
                  <a
                    href="tel:+36303645516"
                    className="flex items-center gap-2 text-sm font-medium text-(--accent) transition-colors hover:text-(--accent)/80"
                  >
                    <PhoneIcon className="size-4" aria-hidden="true" />
                    +36 30 364 5516
                  </a>
                  <a
                    href="mailto:info@synelweb.hu"
                    className="flex items-center gap-2 text-sm font-medium text-(--accent) transition-colors hover:text-(--accent)/80"
                  >
                    <MailIcon className="size-4" aria-hidden="true" />
                    info@synelweb.hu
                  </a>
                </div>
              </PushDrawerContent>
            </PushDrawer>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              aria-label={t("nav.openMenu")}
              disabled
              className="text-(--brand-on-surface) hover:bg-white/10 hover:text-(--brand-on-surface)"
            >
              <MenuToggleIcon open={false} />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
