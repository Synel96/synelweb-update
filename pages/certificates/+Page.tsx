import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRightIcon,
  AwardIcon,
  Code2Icon,
  LayersIcon,
  LayoutGridIcon,
  MegaphoneIcon,
  ServerIcon,
  ShieldCheckIcon,
  type LucideIcon,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { usePageContext } from "vike-react/usePageContext";
import { CertificateCard } from "@/components/CertificateCard";
import { ConversionCtaButton } from "@/components/ConversionCtaButton";
import { trackEvent } from "@/src/analytics";
import { DEFAULT_LANG, type SupportedLang } from "@/src/i18n-config";
import { prefersReducedMotion } from "@/src/prefersReducedMotion";
import { quoteFormHref } from "@/src/quoteForm";
import {
  CERTIFICATE_CATEGORIES,
  getCertificates,
  type Certificate,
  type CertificateCategory,
} from "@/src/services/certificatesService";
import type { AppLang } from "@/src/services/serviceCardsService";

type Data = {
  certificates: Certificate[];
  fetchError: boolean;
};

const CATEGORY_ICONS: Record<CertificateCategory, LucideIcon> = {
  frontend: Code2Icon,
  backend: ServerIcon,
  fullstack: LayersIcon,
  marketing: MegaphoneIcon,
};

const anchor = (category: CertificateCategory) => `tanusitvanyok-${category}`;

// Below lg the cards sit in one swipeable row with the next card peeking in;
// dots, a position counter and a hint (until the first swipe) make clear the
// row scrolls. From lg up it's a plain three-column grid.
function CertificateRow({ items, lang }: { items: Certificate[]; lang: AppLang }) {
  const { t } = useTranslation();
  const rowRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [hasSwiped, setHasSwiped] = useState(false);

  const handleScroll = useCallback(() => {
    const row = rowRef.current;
    if (!row) return;
    const slides = Array.from(row.children) as HTMLElement[];
    let closest = 0;
    let best = Infinity;
    slides.forEach((slide, index) => {
      const distance = Math.abs(slide.offsetLeft - row.offsetLeft - row.scrollLeft);
      if (distance < best) {
        best = distance;
        closest = index;
      }
    });
    setActive(closest);
    if (row.scrollLeft > 8) setHasSwiped(true);
  }, []);

  const goTo = (index: number) => {
    const row = rowRef.current;
    const slide = row?.children[index] as HTMLElement | undefined;
    if (!row || !slide) return;
    row.scrollTo({
      left: slide.offsetLeft - row.offsetLeft,
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  };

  return (
    <>
      <div
        ref={rowRef}
        onScroll={handleScroll}
        className="no-scrollbar -mx-6 flex snap-x snap-mandatory scroll-px-6 items-stretch gap-4 overflow-x-auto px-6 pb-1 lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-6 lg:overflow-visible lg:px-0 lg:pb-0"
      >
        {items.map((certificate) => (
          <div
            key={certificate.id}
            className={`shrink-0 snap-start lg:w-auto ${items.length === 1 ? "w-full" : "w-[82%] sm:w-[60%]"}`}
          >
            <CertificateCard certificate={certificate} lang={lang} />
          </div>
        ))}
      </div>

      {items.length > 1 ? (
        <div className="mt-4 flex items-center gap-3 lg:hidden">
          <div className="flex items-center gap-1.5">
            {items.map((certificate, index) => (
              <button
                key={certificate.id}
                type="button"
                onClick={() => goTo(index)}
                aria-label={t("certificatesPage.dotAria", { index: index + 1 })}
                aria-current={index === active}
                className={`h-1.5 rounded-full transition-all ${
                  index === active ? "w-5 bg-(--accent)" : "w-2 bg-white/30 hover:bg-white/55"
                }`}
              />
            ))}
          </div>
          <p className="flex items-center gap-1.5 text-xs text-white/60" aria-live="polite">
            <span className="font-semibold text-white">
              {t("certificatesPage.swipePosition", { current: active + 1, total: items.length })}
            </span>
            {hasSwiped ? null : (
              <>
                <span aria-hidden="true">·</span>
                {t("certificatesPage.swipeHint")}
                <ArrowRightIcon className="size-3.5" aria-hidden="true" />
              </>
            )}
          </p>
        </div>
      ) : null}
    </>
  );
}

export default function Page() {
  const { t } = useTranslation();
  const pageContext = usePageContext() as { data?: Data; lang?: SupportedLang };
  const lang = (pageContext.lang ?? DEFAULT_LANG) as AppLang;
  const [certificates, setCertificates] = useState<Certificate[]>(
    pageContext.data?.certificates ?? []
  );
  const [fetchError, setFetchError] = useState(pageContext.data?.fetchError ?? false);

  // The prerendered list can be stale or empty (the backend may have been
  // cold-starting during the build): refresh it in the visitor's browser.
  useEffect(() => {
    let isMounted = true;
    getCertificates(lang)
      .then((fresh) => {
        if (!isMounted) return;
        setCertificates(fresh);
        setFetchError(false);
      })
      .catch(() => {
        // Keep whatever is already shown.
      });
    return () => {
      isMounted = false;
    };
  }, [lang]);

  const groups = useMemo(
    () =>
      CERTIFICATE_CATEGORIES.map((category) => ({
        category,
        items: certificates.filter((c) => c.category === category),
      })).filter((group) => group.items.length > 0),
    [certificates]
  );

  const stats: Array<{ Icon: LucideIcon; label: string }> = [
    { Icon: AwardIcon, label: t("certificatesPage.stats.count", { count: certificates.length }) },
    { Icon: LayoutGridIcon, label: t("certificatesPage.stats.areas", { count: groups.length }) },
    // Only claimed when it's true for every certificate shown.
    ...(certificates.every((c) => c.credentialUrl)
      ? [{ Icon: ShieldCheckIcon, label: t("certificatesPage.stats.verifiable") }]
      : []),
  ];

  return (
    <>
      <section className="mx-auto w-full max-w-6xl px-6 pt-36 pb-10 text-center sm:pt-40 sm:pb-12">
        <p className="fancy-eyebrow text-xs font-semibold tracking-[0.2em] text-(--accent) uppercase">
          {t("certificatesPage.label")}
        </p>
        <h1 className="mx-auto mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-balance text-white sm:text-5xl">
          {t("certificatesPage.title")}
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-pretty text-white/78 sm:text-lg">
          {t("certificatesPage.intro")}
        </p>
        {certificates.length > 0 ? (
          <ul className="mt-6 flex flex-wrap justify-center gap-2.5">
            {stats.map(({ Icon, label }) => (
              <li
                key={label}
                className="fancy-chip inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-medium text-white/88"
              >
                <Icon className="size-4 text-(--color-secondary-warm)" aria-hidden="true" />
                {label}
              </li>
            ))}
          </ul>
        ) : null}
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 pb-16 sm:pb-20">
        {fetchError && certificates.length === 0 ? (
          <div className="fancy-panel rounded-3xl p-8 text-center text-white/86">
            {t("certificatesPage.fetchError")}
          </div>
        ) : certificates.length === 0 ? (
          <div className="fancy-panel rounded-3xl p-8 text-center text-white/86">
            {t("certificatesPage.emptyState")}
          </div>
        ) : (
          <>
            {groups.length > 1 ? (
              <nav
                aria-label={t("certificatesPage.label")}
                className="mb-12 flex flex-wrap justify-center gap-2"
              >
                <a
                  href="#tanusitvanyok"
                  className="inline-flex items-center gap-2 rounded-full border border-(--accent)/60 bg-linear-to-r from-(--color-secondary-warm)/20 to-(--accent)/25 px-4 py-2 text-xs font-semibold tracking-[0.1em] text-white uppercase"
                >
                  {t("certificatesPage.filterAll")}
                  <span className="text-(--accent)">{certificates.length}</span>
                </a>
                {groups.map(({ category, items }) => (
                  <a
                    key={category}
                    href={`#${anchor(category)}`}
                    className="fancy-chip inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold tracking-[0.1em] text-white/80 uppercase"
                  >
                    {t(`certificatesPage.categories.${category}.title`)}
                    <span className="text-white/55">{items.length}</span>
                  </a>
                ))}
              </nav>
            ) : null}

            <div id="tanusitvanyok" className="scroll-mt-28 space-y-16">
              {groups.map(({ category, items }) => {
                const Icon = CATEGORY_ICONS[category];
                return (
                  <section
                    key={category}
                    id={anchor(category)}
                    aria-labelledby={`${anchor(category)}-title`}
                    className="scroll-mt-28"
                  >
                    <header className="mb-6 flex items-center gap-4 sm:mb-8 sm:gap-5">
                      <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-linear-135 from-(--color-secondary-warm) to-(--accent) text-[#140814] shadow-[0_10px_24px_-10px_var(--accent-glow)] sm:size-14">
                        <Icon className="size-6" aria-hidden="true" />
                      </span>
                      <div>
                        <p className="fancy-eyebrow text-[0.68rem] font-semibold tracking-[0.18em] text-(--color-secondary-warm) uppercase">
                          {t("certificatesPage.countLabel", { count: items.length })}
                        </p>
                        <h2
                          id={`${anchor(category)}-title`}
                          className="mt-1.5 text-2xl font-semibold tracking-tight text-white sm:text-3xl"
                        >
                          {t(`certificatesPage.categories.${category}.title`)}
                        </h2>
                        <p className="mt-1.5 max-w-2xl text-sm leading-6 text-white/70 sm:text-base">
                          {t(`certificatesPage.categories.${category}.text`)}
                        </p>
                      </div>
                    </header>
                    <CertificateRow items={items} lang={lang} />
                  </section>
                );
              })}
            </div>
          </>
        )}
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 pb-20 sm:pb-24">
        <div className="fancy-card flex flex-col items-start gap-6 rounded-3xl p-6 sm:p-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-tight text-balance text-white sm:text-3xl">
              {t("certificatesPage.cta.title")}
            </h2>
            <p className="mt-3 text-base leading-7 text-white/75">
              {t("certificatesPage.cta.text")}
            </p>
          </div>
          <ConversionCtaButton
            href={quoteFormHref(lang)}
            onClick={() => trackEvent("quote_cta_click", { location: "certificates" })}
          >
            {t("certificatesPage.cta.button")}
          </ConversionCtaButton>
        </div>
      </section>
    </>
  );
}
