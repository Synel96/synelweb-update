import {
  BadgeCheckIcon,
  BriefcaseIcon,
  CpuIcon,
  FolderKanbanIcon,
  GaugeIcon,
  HomeIcon,
  MailIcon,
  NewspaperIcon,
  PhoneIcon,
  UserRoundIcon,
  type LucideIcon,
} from "lucide-react";
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
import { BRAND_NAME, NAV_LINKS, visibleSubLinks } from "./site";
import { NavDropdown } from "./NavDropdown";
import { LanguageSwitcher, LanguageSwitcherDropdown } from "./LanguageSwitcher";
import { DEFAULT_LANG, type SupportedLang } from "@/src/i18n-config";
import { localizePath, resolveLanguageAndLogicalPath } from "@/src/localizedRoutes";

// Icons for the mobile menu's items.
const NAV_ICONS: Record<string, LucideIcon> = {
  "/": HomeIcon,
  "/services": BriefcaseIcon,
  "/site-check": GaugeIcon,
  "/projects": FolderKanbanIcon,
  "/certificates": BadgeCheckIcon,
  "/blog": NewspaperIcon,
  "/technology": CpuIcon,
  "/contact": MailIcon,
  "/about": UserRoundIcon,
};

// Items that get a small badge in the mobile menu.
const NAV_BADGES: Record<string, string> = { "/site-check": "nav.freeBadge" };

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

  const isExactlyActive = (href: string) =>
    href === "/" ? logicalPath === href : logicalPath.startsWith(href);
  // A link with a submenu is also active on its subpages (e.g. Services on
  // the regional pages).
  const isActive = (href: string) =>
    isExactlyActive(href) ||
    NAV_LINKS.some(
      (item) =>
        item.href === href &&
        visibleSubLinks(item, lang, { includeFooterOnly: true }).some((sub) =>
          isExactlyActive(sub.href)
        )
    );

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

        <nav className="hidden items-center gap-3.5 text-sm lg:flex xl:gap-6 xl:text-base">
          {visibleNavLinks
            .filter((item) => !item.hiddenInDesktopNav)
            .map((item) => {
              const subLinks = visibleSubLinks(item, lang);
              return subLinks.length > 0 ? (
                <NavDropdown
                  key={item.href}
                  label={navLabel(item)}
                  href={langHref(item.href)}
                  className={navLinkClass(item.href)}
                  toggleLabel={`${navLabel(item)}: ${t("nav.navigationMenu")}`}
                  items={subLinks.map((sub) => ({
                    href: langHref(sub.href),
                    label: sub.label,
                    active: logicalPath === sub.href,
                  }))}
                />
              ) : (
                <a key={item.href} href={langHref(item.href)} className={navLinkClass(item.href)}>
                  {navLabel(item)}
                </a>
              );
            })}
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
                <div className="px-5 pt-5 pb-3">
                  <a
                    href={langHref("/")}
                    className="brand-tech bg-[linear-gradient(120deg,var(--color-secondary-warm),var(--color-secondary-hot)_62%,var(--color-secondary-warm))] bg-clip-text text-lg font-semibold tracking-[0.14em] text-transparent"
                  >
                    {BRAND_NAME}
                  </a>
                  {/* Up top, so visitors looking for their language find it first. */}
                  <div className="mt-3">
                    <LanguageSwitcher />
                  </div>
                </div>

                <nav className="flex flex-col gap-0.5 px-3 pb-4">
                  {visibleNavLinks.map((item) => {
                    const Icon = NAV_ICONS[item.href];
                    const active = isActive(item.href);
                    const badge = NAV_BADGES[item.href];
                    return (
                      <div key={item.href} className="flex flex-col">
                        <PushDrawerClose asChild>
                          <a
                            href={langHref(item.href)}
                            aria-current={logicalPath === item.href ? "page" : undefined}
                            className={`relative flex items-center gap-3 rounded-xl px-3 py-2 text-[0.95rem] transition-colors ${
                              active
                                ? "bg-linear-to-r from-(--color-secondary-warm)/15 to-(--accent)/15 font-medium text-white"
                                : "text-white/75 hover:bg-white/6 hover:text-white"
                            }`}
                          >
                            {active ? (
                              <span
                                className="absolute top-2 bottom-2 left-0 w-1 rounded-full bg-linear-to-b from-(--color-secondary-warm) to-(--accent)"
                                aria-hidden="true"
                              />
                            ) : null}
                            {Icon ? (
                              <span
                                className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${
                                  active
                                    ? "bg-white/10 text-(--accent)"
                                    : "bg-white/5 text-white/60"
                                }`}
                              >
                                <Icon className="size-4" aria-hidden="true" />
                              </span>
                            ) : null}
                            <span className="flex-1">{navLabel(item)}</span>
                            {badge ? (
                              <span className="rounded-full border border-emerald-300/40 bg-emerald-400/12 px-2 py-0.5 text-[0.62rem] font-bold tracking-[0.08em] text-emerald-300 uppercase">
                                {t(badge)}
                              </span>
                            ) : null}
                          </a>
                        </PushDrawerClose>
                        {visibleSubLinks(item, lang)
                          .filter((sub) => sub.href !== item.href)
                          .map((sub) => (
                            <PushDrawerClose asChild key={sub.href}>
                              <a
                                href={langHref(sub.href)}
                                aria-current={logicalPath === sub.href ? "page" : undefined}
                                className={`ml-[1.65rem] border-l border-white/10 py-1.5 pl-5 text-sm transition-colors ${
                                  logicalPath === sub.href
                                    ? "border-(--accent) font-medium text-white"
                                    : "text-white/60 hover:text-white"
                                }`}
                              >
                                {sub.label}
                              </a>
                            </PushDrawerClose>
                          ))}
                      </div>
                    );
                  })}
                </nav>

                <div className="flex flex-col gap-2 border-t border-white/10 px-4 pt-4 pb-6">
                  <a
                    href="tel:+36303645516"
                    className="flex items-center gap-3 rounded-xl bg-white/5 px-3 py-2.5 text-sm font-medium text-white/85 transition-colors hover:bg-white/10"
                  >
                    <PhoneIcon className="size-4 text-(--accent)" aria-hidden="true" />
                    +36 30 364 5516
                  </a>
                  <a
                    href="mailto:info@synelweb.hu"
                    className="flex items-center gap-3 rounded-xl bg-white/5 px-3 py-2.5 text-sm font-medium text-white/85 transition-colors hover:bg-white/10"
                  >
                    <MailIcon className="size-4 text-(--accent)" aria-hidden="true" />
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
