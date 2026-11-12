import { useEffect, useState } from "react";
import {
  ArrowRightIcon,
  ChevronDownIcon,
  EuroIcon,
  ExternalLinkIcon,
  GaugeIcon,
  LanguagesIcon,
  MapPinIcon,
  ScaleIcon,
  UsersIcon,
  type LucideIcon,
} from "lucide-react";
import { ConversionCtaButton } from "@/components/ConversionCtaButton";
import { trackEvent } from "@/src/analytics";
import { localizePath, type RegionalLogicalPath } from "@/src/localizedRoutes";
import { quoteFormHref } from "@/src/quoteForm";
import { REGIONAL_CONTENT, type RegionalBenefitIcon } from "@/src/regionalPages";
import { getProjects, type Project } from "@/src/services/projectServices";
import {
  getServiceCards,
  type AppLang,
  type ServiceCard,
} from "@/src/services/serviceCardsService";

export type RegionalPageData = {
  services: ServiceCard[];
  reference: Project | null;
};

const BENEFIT_ICONS: Record<RegionalBenefitIcon, LucideIcon> = {
  meet: UsersIcon,
  languages: LanguagesIcon,
  map: MapPinIcon,
  gauge: GaugeIcon,
  legal: ScaleIcon,
  euro: EuroIcon,
};

// The local reference shown on the regional pages.
export function findRegionalReference(projects: Project[]): Project | null {
  return projects.find((project) => /alpha\s*-?\s*dent/i.test(project.name)) ?? null;
}

type RegionalLandingPageProps = {
  page: RegionalLogicalPath;
  lang: AppLang;
  initial: RegionalPageData;
};

export function RegionalLandingPage({ page, lang, initial }: RegionalLandingPageProps) {
  const content = REGIONAL_CONTENT[page];
  const [services, setServices] = useState(initial.services);
  const [reference, setReference] = useState(initial.reference);
  const quoteHref = quoteFormHref(lang);
  const servicesHref = localizePath("/services", lang);
  const location = page === "/sopron" ? "sopron" : "austria";

  // The prerendered lists can be stale or empty (the backend may have been
  // cold-starting during the build): refresh them in the visitor's browser.
  useEffect(() => {
    let isMounted = true;
    getServiceCards(lang)
      .then((fresh) => isMounted && setServices(fresh))
      .catch(() => {});
    getProjects(lang)
      .then((fresh) => isMounted && setReference(findRegionalReference(fresh)))
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, [lang]);

  const mobileScores =
    reference?.mobileScores.filter((score) => Number.isFinite(score.value)) ?? [];

  return (
    <>
      <section className="mx-auto w-full max-w-6xl px-6 pt-36 pb-12 text-center sm:pt-40 sm:pb-16">
        <p className="fancy-eyebrow text-xs font-semibold tracking-[0.2em] text-(--accent) uppercase">
          {content.eyebrow}
        </p>
        <h1 className="mx-auto mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-balance text-white sm:text-5xl">
          {content.title}
        </h1>
        <p className="mx-auto mt-6 max-w-3xl text-left text-base leading-8 text-white/78 sm:text-center sm:text-lg">
          {content.intro}
        </p>
        <p className="mx-auto mt-4 max-w-3xl text-left text-base leading-8 font-semibold text-white sm:text-center sm:text-lg">
          {content.introStrong}
        </p>
        <div className="mt-8 flex justify-center">
          <ConversionCtaButton
            href={quoteHref}
            onClick={() => trackEvent("quote_cta_click", { location: `${location}_hero` })}
          >
            {content.ctaButton}
          </ConversionCtaButton>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 pb-16 sm:pb-20" data-reveal>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold tracking-[0.22em] text-(--color-secondary-warm) uppercase">
            {content.benefitsLabel}
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-balance text-white sm:text-4xl">
            {content.benefitsTitle}
          </h2>
        </div>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {content.benefits.map(({ icon, title, text }) => {
            const Icon = BENEFIT_ICONS[icon];
            return (
              <li key={title} className="fancy-card rounded-2xl p-5 sm:p-6">
                <div className="flex gap-4">
                  <span className="fancy-tile flex size-11 shrink-0 items-center justify-center rounded-xl">
                    <Icon className="size-5 text-(--accent)" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold tracking-tight text-white">{title}</h3>
                    <p className="mt-2 text-sm leading-7 text-white/78 sm:text-base">{text}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      {reference ? (
        <section className="mx-auto w-full max-w-6xl px-6 pb-16 sm:pb-20" data-reveal>
          <div className="fancy-card grid overflow-hidden rounded-3xl lg:grid-cols-[1.1fr_0.9fr]">
            {reference.previewImage ? (
              <img
                src={reference.previewImage}
                alt={reference.name}
                className="aspect-video h-full w-full object-cover object-top lg:aspect-auto"
                loading="lazy"
                decoding="async"
              />
            ) : null}
            <div className="flex flex-col p-6 sm:p-8">
              <p className="text-xs font-semibold tracking-[0.2em] text-(--color-secondary-warm) uppercase">
                {content.referenceLabel}
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-balance text-white sm:text-3xl">
                {content.referenceTitle}
              </h2>
              <p className="mt-3 text-base leading-7 text-white/78">{content.referenceText}</p>
              {mobileScores.length > 0 ? (
                <>
                  <p className="mt-5 text-xs font-semibold tracking-[0.16em] text-white/60 uppercase">
                    {content.referenceScoresLabel}
                  </p>
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {mobileScores.map((score) => (
                      <li
                        key={score.label}
                        className="fancy-chip rounded-full px-3 py-1 text-sm font-medium text-white/88"
                      >
                        {score.label}{" "}
                        <span className="font-semibold text-emerald-300">{score.value}</span>
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}
              {reference.liveUrl ? (
                <a
                  href={reference.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold tracking-[0.08em] text-(--accent) uppercase transition-colors hover:text-(--primary)"
                >
                  {content.referenceLink}
                  <ExternalLinkIcon className="size-4" aria-hidden="true" />
                  <span className="sr-only">: {reference.name}</span>
                </a>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      {services.length > 0 ? (
        <section className="mx-auto w-full max-w-6xl px-6 pb-16 sm:pb-20" data-reveal>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold tracking-[0.22em] text-(--accent) uppercase">
              {content.servicesLabel}
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-balance text-white sm:text-4xl">
              {content.servicesTitle}
            </h2>
            <p className="mt-4 text-base leading-7 text-white/75">{content.servicesText}</p>
          </div>
          <ul className="fancy-card mx-auto mt-8 max-w-3xl divide-y divide-white/10 rounded-3xl px-5 sm:px-8">
            {services.map((service) => {
              const price = service.hasDiscount ? service.discountedPrice : service.regularPrice;
              return (
                <li
                  key={service.id}
                  className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-4"
                >
                  <span className="font-medium text-white">{service.name}</span>
                  <span className="text-sm font-semibold text-(--color-secondary-warm)">
                    {price}
                    {service.monthlyPrice ? (
                      <span className="text-white/70">
                        {" + "}
                        {service.monthlyPrice} {content.perMonth}
                      </span>
                    ) : null}
                  </span>
                </li>
              );
            })}
          </ul>
          <div className="mt-6 text-center">
            <a
              href={servicesHref}
              className="group inline-flex items-center gap-2 text-sm font-semibold tracking-[0.08em] text-(--accent) uppercase transition-colors hover:text-(--primary)"
            >
              {content.servicesLink}
              <ArrowRightIcon
                className="size-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </a>
          </div>
        </section>
      ) : null}

      <section className="mx-auto w-full max-w-6xl px-6 pb-16 sm:pb-20" data-reveal>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold tracking-[0.22em] text-(--color-secondary-warm) uppercase">
            {content.areasLabel}
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-balance text-white sm:text-4xl">
            {content.areasTitle}
          </h2>
        </div>
        <ul className="mx-auto mt-6 flex max-w-3xl flex-wrap justify-center gap-2.5">
          {content.areas.map((area) => (
            <li
              key={area}
              className="fancy-chip inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium text-white/88"
            >
              <MapPinIcon className="size-3.5 text-(--accent)" aria-hidden="true" />
              {area}
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto w-full max-w-3xl px-6 pb-16 sm:pb-20" data-reveal>
        <h2 className="text-center text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          {content.faqTitle}
        </h2>
        <div className="mt-8 space-y-3">
          {content.faq.map(({ q, a }) => (
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

      <section className="mx-auto w-full max-w-6xl px-6 pb-20 sm:pb-24">
        <div className="fancy-card flex flex-col items-start gap-6 rounded-3xl p-6 sm:p-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-tight text-balance text-white sm:text-3xl">
              {content.finalTitle}
            </h2>
            <p className="mt-3 text-base leading-7 text-white/75">{content.finalText}</p>
          </div>
          <ConversionCtaButton
            href={quoteHref}
            onClick={() => trackEvent("quote_cta_click", { location: `${location}_final` })}
          >
            {content.ctaButton}
          </ConversionCtaButton>
        </div>
      </section>
    </>
  );
}
