import { useEffect, useRef, useState } from "react";
import { CalendarIcon, PhoneIcon, SendIcon, XIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { usePageContext } from "vike-react/usePageContext";
import { DEFAULT_LANG, type SupportedLang } from "@/src/i18n-config";
import { localizePath, resolveLanguageAndLogicalPath } from "@/src/localizedRoutes";

const PHONE = "+36303645516";

// The contact page already surfaces the same call/quote actions prominently,
// so showing this floating duplicate there would just be visual noise.
const HIDDEN_ON_LOGICAL_PATHS = new Set(["/contact"]);

export function MobileStickyCta() {
  const { t } = useTranslation();
  const pageContext = usePageContext() as { urlPathname: string; lang?: SupportedLang };
  const lang = pageContext.lang ?? DEFAULT_LANG;
  const { logicalPath } = resolveLanguageAndLogicalPath(pageContext.urlPathname);
  const [expanded, setExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setExpanded(false);
  }, [pageContext.urlPathname]);

  useEffect(() => {
    if (!expanded) return;

    const collapse = (event: MouseEvent | TouchEvent | KeyboardEvent) => {
      if (event instanceof KeyboardEvent) {
        if (event.key === "Escape") setExpanded(false);
        return;
      }
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setExpanded(false);
      }
    };

    document.addEventListener("mousedown", collapse);
    document.addEventListener("touchstart", collapse);
    document.addEventListener("keydown", collapse);
    return () => {
      document.removeEventListener("mousedown", collapse);
      document.removeEventListener("touchstart", collapse);
      document.removeEventListener("keydown", collapse);
    };
  }, [expanded]);

  if (HIDDEN_ON_LOGICAL_PATHS.has(logicalPath)) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-x-0 bottom-0 z-40 flex justify-end px-4 lg:hidden"
      style={{ paddingBottom: "calc(1rem + env(safe-area-inset-bottom))" }}
    >
      <div className="flex flex-col items-end gap-2.5">
        <a
          href={localizePath("/contact", lang)}
          aria-hidden={!expanded}
          tabIndex={expanded ? 0 : -1}
          className={`flex items-center gap-2 rounded-full border border-white/15 bg-(--color-secondary-warm) px-4 py-2.5 text-sm font-semibold text-[#140814] shadow-[0_12px_30px_-10px_color-mix(in_oklab,var(--color-secondary-warm),transparent_55%)] transition-all duration-200 ${
            expanded
              ? "pointer-events-auto translate-y-0 opacity-100"
              : "pointer-events-none translate-y-2 opacity-0"
          }`}
        >
          <SendIcon className="size-4" aria-hidden="true" />
          {t("stickyCta.quote")}
        </a>

        <a
          href={`tel:${PHONE}`}
          aria-hidden={!expanded}
          tabIndex={expanded ? 0 : -1}
          className={`flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-200 ${
            expanded
              ? "pointer-events-auto translate-y-0 opacity-100"
              : "pointer-events-none translate-y-2 opacity-0"
          }`}
        >
          <PhoneIcon className="size-4" aria-hidden="true" />
          {t("stickyCta.call")}
        </a>

        <div className="relative">
          {!expanded ? (
            <span
              className="sticky-cta-pulse absolute inset-0 rounded-full bg-(--color-secondary-warm)"
              aria-hidden="true"
            />
          ) : null}

          <button
            type="button"
            onClick={() => setExpanded((current) => !current)}
            aria-expanded={expanded}
            aria-label={expanded ? t("stickyCta.closeAria") : t("stickyCta.triggerAria")}
            className="relative isolate z-10 flex size-14 items-center justify-center overflow-hidden rounded-full border border-white/25 text-[#140814] shadow-[0_18px_44px_-18px_color-mix(in_oklab,var(--color-secondary-warm),transparent_45%)] transition-transform duration-200 hover:-translate-y-0.5 active:scale-95"
            style={{
              background:
                "radial-gradient(120% 120% at 30% 25%, color-mix(in oklab, var(--color-secondary-warm), white 32%) 0%, var(--color-secondary-warm) 55%, color-mix(in oklab, var(--color-secondary-warm), black 14%) 100%)",
            }}
          >
            <span className="btn-cta-shine" aria-hidden="true" />
            <span className="relative z-10">
              {expanded ? (
                <XIcon className="size-5" aria-hidden="true" />
              ) : (
                <CalendarIcon className="size-5" aria-hidden="true" />
              )}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
