import { useEffect, useState } from "react";
import {
  BadgeCheckIcon,
  ChevronDownIcon,
  ExternalLinkIcon,
  MousePointerClickIcon,
  SearchIcon,
  TrendingUpIcon,
  type LucideIcon,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { usePageContext } from "vike-react/usePageContext";
import { AdsTerms } from "@/components/AdsTerms";
import { ConversionCtaButton } from "@/components/ConversionCtaButton";
import { ServiceCard } from "@/components/ServiceCard";
import { trackEvent } from "@/src/analytics";
import { useCertificates } from "@/src/hooks/use-certificates";
import { DEFAULT_LANG, type SupportedLang } from "@/src/i18n-config";
import { localizePath } from "@/src/localizedRoutes";
import { quoteFormHref } from "@/src/quoteForm";
import type { Certificate } from "@/src/services/certificatesService";
import {
  getServiceCards,
  type AppLang,
  type ServiceCard as ServiceCardItem,
} from "@/src/services/serviceCardsService";

type Data = {
  cards: ServiceCardItem[];
  certificates: Certificate[];
};

const WHY_ITEMS: Array<{ key: string; Icon: LucideIcon }> = [
  { key: "intent", Icon: SearchIcon },
  { key: "payPerClick", Icon: MousePointerClickIcon },
  { key: "measurable", Icon: TrendingUpIcon },
];

const PROCESS_STEPS = ["audit", "setup", "learning", "optimize"] as const;

function asFaq(value: unknown): Array<{ q: string; a: string }> {
  return Array.isArray(value)
    ? value.filter(
        (item): item is { q: string; a: string } =>
          typeof item?.q === "string" && typeof item?.a === "string"
      )
    : [];
}

export default function Page() {
  const { t } = useTranslation();
  const pageContext = usePageContext() as { data?: Data; lang?: SupportedLang };
  const lang = (pageContext.lang ?? DEFAULT_LANG) as AppLang;
  const [cards, setCards] = useState<ServiceCardItem[]>(pageContext.data?.cards ?? []);
  const certificates = useCertificates(lang, pageContext.data?.certificates ?? []);
  const quoteHref = quoteFormHref(lang);
  const contactHref = localizePath("/contact", lang);

  // The prerendered prices can be stale or missing: refresh them.
  useEffect(() => {
    let isMounted = true;
    getServiceCards(lang)
      .then((fresh) => {
        if (isMounted) setCards(fresh.filter((card) => card.category === "marketing"));
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, [lang]);

  const adsCertificates = certificates.filter(
    (c) => c.category === "marketing" && c.kind === "exam" && !c.isExpired
  );
  const faq = asFaq(t("adsPage.faq.items", { returnObjects: true }));

  return (
    <>
      <section className="mx-auto w-full max-w-6xl px-6 pt-36 pb-12 text-center sm:pt-40 sm:pb-16">
        <p className="fancy-eyebrow text-xs font-semibold tracking-[0.2em] text-(--accent) uppercase">
          {t("adsPage.label")}
        </p>
        <h1 className="mx-auto mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-balance text-white sm:text-5xl">
          {t("adsPage.title")}
        </h1>
        <p className="mx-auto mt-6 max-w-3xl text-left text-base leading-8 text-white/78 sm:text-center sm:text-lg">
          {t("adsPage.intro")}
        </p>
        <p className="mx-auto mt-4 max-w-3xl text-left text-base leading-8 font-semibold text-white sm:text-center sm:text-lg">
          {t("adsPage.introStrong")}
        </p>
        <div className="mt-8 flex justify-center">
          <ConversionCtaButton
            href={quoteHref}
            onClick={() => trackEvent("quote_cta_click", { location: "google_ads_hero" })}
          >
            {t("adsPage.cta")}
          </ConversionCtaButton>
        </div>
        {adsCertificates.length > 0 ? (
          <ul className="mt-8 flex flex-wrap justify-center gap-2.5">
            {adsCertificates.map((certificate) => (
              <li key={certificate.id}>
                <a
                  href={certificate.credentialUrl || localizePath("/certificates", lang)}
                  target={certificate.credentialUrl ? "_blank" : undefined}
                  rel={certificate.credentialUrl ? "noreferrer" : undefined}
                  className="inline-flex items-center gap-2 rounded-full border border-emerald-300/40 bg-emerald-400/12 px-3.5 py-1.5 text-sm font-medium text-emerald-200 transition-colors hover:bg-emerald-400/20"
                >
                  <BadgeCheckIcon className="size-4 text-emerald-300" aria-hidden="true" />
                  {certificate.title}
                  {certificate.credentialUrl ? (
                    <ExternalLinkIcon className="size-3.5" aria-hidden="true" />
                  ) : null}
                </a>
              </li>
            ))}
          </ul>
        ) : null}
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 pb-16 sm:pb-20" data-reveal>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold tracking-[0.22em] text-(--color-secondary-warm) uppercase">
            {t("adsPage.why.label")}
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-balance text-white sm:text-4xl">
            {t("adsPage.why.title")}
          </h2>
        </div>
        <ul className="mt-8 grid gap-4 md:grid-cols-3">
          {WHY_ITEMS.map(({ key, Icon }) => (
            <li key={key} className="fancy-card rounded-2xl p-5 sm:p-6">
              <span className="fancy-tile flex size-11 items-center justify-center rounded-xl">
                <Icon className="size-5 text-(--accent)" aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-lg font-semibold tracking-tight text-white">
                {t(`adsPage.why.items.${key}.title`)}
              </h3>
              <p className="mt-2 text-sm leading-7 text-white/78 sm:text-base">
                {t(`adsPage.why.items.${key}.text`)}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 pb-16 sm:pb-20" data-reveal>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold tracking-[0.22em] text-(--accent) uppercase">
            {t("adsPage.pricing.label")}
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-balance text-white sm:text-4xl">
            {t("adsPage.pricing.title")}
          </h2>
          <p className="mt-4 text-base leading-7 text-white/75">{t("adsPage.pricing.text")}</p>
        </div>
        {cards.length > 0 ? (
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {cards.map((card) => (
              <div
                key={card.id}
                className={
                  cards.length === 1 ? "lg:col-span-2 lg:mx-auto lg:w-full lg:max-w-2xl" : ""
                }
              >
                <ServiceCard
                  serviceName={card.name}
                  description={card.description}
                  regularPrice={card.regularPrice}
                  discountedPrice={card.discountedPrice}
                  hasDiscount={card.hasDiscount}
                  discountLabel={t("servicesPage.discountBadge")}
                  monthlyPrice={card.monthlyPrice}
                  setupFeeLabel={t("servicesPage.setupFeeLabel")}
                  monthlyFeeLabel={t("servicesPage.monthlyFeeLabel")}
                  perMonth={(price) => t("servicesPage.perMonth", { price })}
                  certifications={adsCertificates.map((c) => ({
                    title: c.title,
                    url: c.credentialUrl,
                  }))}
                  certifiedLabel={t("servicesPage.certifiedWith")}
                  expandLabel={t("servicesPage.expandDescription")}
                  collapseLabel={t("servicesPage.collapseDescription")}
                  slug={card.slug}
                  images={card.images}
                  contactBaseHref={contactHref}
                  ctaLabel={t("servicesPage.cardCta")}
                  ctaAriaLabel={t("servicesPage.cardCtaAria")}
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="fancy-panel mx-auto mt-8 max-w-2xl rounded-2xl p-6 text-center text-white/85">
            {t("adsPage.pricing.empty")}
          </p>
        )}
        <AdsTerms />
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 pb-16 sm:pb-20" data-reveal>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold tracking-[0.22em] text-(--color-secondary-warm) uppercase">
            {t("adsPage.process.label")}
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-balance text-white sm:text-4xl">
            {t("adsPage.process.title")}
          </h2>
        </div>
        <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PROCESS_STEPS.map((step, index) => (
            <li key={step} className="fancy-card rounded-2xl p-5">
              <span className="flex size-9 items-center justify-center rounded-full bg-linear-135 from-(--color-secondary-warm) to-(--accent) text-sm font-bold text-[#140814]">
                {index + 1}
              </span>
              <h3 className="mt-4 text-lg font-semibold tracking-tight text-white">
                {t(`adsPage.process.steps.${step}.title`)}
              </h3>
              <p className="mt-2 text-sm leading-7 text-white/78">
                {t(`adsPage.process.steps.${step}.text`)}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {faq.length > 0 ? (
        <section className="mx-auto w-full max-w-3xl px-6 pb-16 sm:pb-20" data-reveal>
          <h2 className="text-center text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {t("adsPage.faq.title")}
          </h2>
          <div className="mt-8 space-y-3">
            {faq.map(({ q, a }) => (
              <details key={q} className="fancy-card group rounded-2xl p-5 open:pb-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-white [&::-webkit-details-marker]:hidden">
                  <h3 className="text-base sm:text-lg">{q}</h3>
                  <ChevronDownIcon
                    className="size-5 shrink-0 text-(--accent) transition-transform group-open:rotate-180"
                    aria-hidden="true"
                  />
                </summary>
                <p className="mt-3 text-base leading-7 text-white/78">{a}</p>
              </details>
            ))}
          </div>
        </section>
      ) : null}

      <section className="mx-auto w-full max-w-6xl px-6 pb-20 sm:pb-24">
        <div className="fancy-card flex flex-col items-start gap-6 rounded-3xl p-6 sm:p-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-tight text-balance text-white sm:text-3xl">
              {t("adsPage.final.title")}
            </h2>
            <p className="mt-3 text-base leading-7 text-white/75">{t("adsPage.final.text")}</p>
          </div>
          <ConversionCtaButton
            href={quoteHref}
            onClick={() => trackEvent("quote_cta_click", { location: "google_ads_final" })}
          >
            {t("adsPage.cta")}
          </ConversionCtaButton>
        </div>
      </section>
    </>
  );
}
