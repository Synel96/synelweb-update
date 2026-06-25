import { MenuIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { usePageContext } from "vike-react/usePageContext";
import { Button } from "@/components/ui/button";
import { useMounted } from "@/src/hooks/use-mounted";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { BRAND_NAME, NAV_LINKS } from "./site";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const mounted = useMounted();
  const pageContext = usePageContext();
  const { urlPathname } = pageContext;
  const { t } = useTranslation();

  const isActive = (href: string) =>
    href === "/" ? urlPathname === href : urlPathname.startsWith(href);

  const navLinkClass = (href: string) =>
    isActive(href)
      ? "font-medium text-(--brand-on-surface)"
      : "text-white/70 transition-colors hover:text-(--brand-on-surface)";

  return (
    <header className="border-b border-white/10 bg-(--brand-surface) text-(--brand-on-surface) backdrop-blur supports-backdrop-filter:bg-[color-mix(in_oklch,var(--brand-surface),transparent_5%)]">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
        <a href="/" className="text-base font-semibold tracking-tight text-(--brand-on-surface)">
          {BRAND_NAME}
        </a>

        <nav className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((item) => (
            <a key={item.href} href={item.href} className={navLinkClass(item.href)}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center md:flex">
          <LanguageSwitcher />
        </div>

        <div className="md:hidden">
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
                className="w-80 border-r-white/10 bg-(--brand-surface) text-(--brand-on-surface)"
              >
                <SheetHeader>
                  <SheetTitle>{BRAND_NAME}</SheetTitle>
                  <SheetDescription className="text-white/70">{t("nav.navigationMenu")}</SheetDescription>
                </SheetHeader>

                <nav className="mt-2 flex flex-col gap-1 px-4 pb-6">
                  {NAV_LINKS.map((item) => (
                    <SheetClose asChild key={item.href}>
                      <a
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={`rounded-md px-3 py-2 text-sm ${
                          isActive(item.href)
                            ? "bg-white/15 font-medium text-(--brand-on-surface)"
                            : "text-white/75 hover:bg-white/10 hover:text-(--brand-on-surface)"
                        }`}
                      >
                        {item.label}
                      </a>
                    </SheetClose>
                  ))}
                </nav>
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
