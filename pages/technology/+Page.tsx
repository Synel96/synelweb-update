import { GaugeIcon, SearchIcon, ShieldCheckIcon, TrophyIcon } from "lucide-react";
import { Trans, useTranslation } from "react-i18next";
import { usePageContext } from "vike-react/usePageContext";
import { ConversionCtaButton } from "@/components/ConversionCtaButton";
import { TechnologyStackCard } from "@/components/TechnologyStackCard";
import { DEFAULT_LANG, type SupportedLang } from "@/src/i18n-config";
import { localizePath } from "@/src/localizedRoutes";
import { quoteFormHref } from "@/src/quoteForm";
import { trackEvent } from "@/src/analytics";
import { isTechnologyLogoName, type TechnologyLogoName } from "@/components/TechnologyLogo";

type TechnologyCard = {
  logo: TechnologyLogoName;
  name: string;
  title: string;
  summary: string;
  valueLabel: string;
  valueText: string;
  badge: string;
};

function BrandWord({ children, className }: { children?: React.ReactNode; className: string }) {
  return <span className={className}>{children}</span>;
}

function readTechnologyCards(value: unknown): TechnologyCard[] {
  if (!Array.isArray(value)) return [];

  return value
    .filter((item): item is Record<string, unknown> => typeof item === "object" && item !== null)
    .map((item) => ({
      logo: item.logo,
      name: String(item.name ?? ""),
      title: String(item.title ?? ""),
      summary: String(item.summary ?? ""),
      valueLabel: String(item.valueLabel ?? ""),
      valueText: String(item.valueText ?? ""),
      badge: String(item.badge ?? ""),
    }))
    .filter(
      (item): item is TechnologyCard =>
        isTechnologyLogoName(item.logo) &&
        item.name.length > 0 &&
        item.title.length > 0 &&
        item.summary.length > 0 &&
        item.valueLabel.length > 0 &&
        item.valueText.length > 0 &&
        item.badge.length > 0
    );
}

// What the sites built here have already shown: search results, Google's own
// measurements, saturated markets, and scores anyone can check on the
// references page.
const PROOF_ITEMS = [
  { key: "search", Icon: SearchIcon },
  { key: "measured", Icon: GaugeIcon },
  { key: "competitive", Icon: TrophyIcon },
  { key: "verifiable", Icon: ShieldCheckIcon },
] as const;

export default function Page() {
  const pageContext = usePageContext() as { lang?: SupportedLang };
  const lang = pageContext.lang ?? DEFAULT_LANG;
  // Its call to action goes straight to the quote form.
  const contactHref = quoteFormHref(lang);
  const { t } = useTranslation();
  const cards = readTechnologyCards(t("technology.cards", { returnObjects: true }));
  const brandComponents = {
    techReact: <BrandWord className="font-semibold tracking-[0.04em] text-[#61dafb]" />,
    techReactPlain: <BrandWord className="font-semibold text-white" />,
    techTailwind: <BrandWord className="font-semibold tracking-[0.04em] text-[#38bdf8]" />,
    techTailwindPlain: <BrandWord className="font-semibold text-white" />,
    techPython: <BrandWord className="font-semibold tracking-[0.04em] text-[#ffd43b]" />,
    techPythonPlain: <BrandWord className="font-semibold text-white" />,
    techDjango: <BrandWord className="font-semibold tracking-[0.04em] text-[#44b78b]" />,
    techDjangoPlain: <BrandWord className="font-semibold text-white" />,
    techPostgres: <BrandWord className="font-semibold tracking-[0.04em] text-[#6aa6d1]" />,
    techPostgresPlain: <BrandWord className="font-semibold text-white" />,
  };

  return (
    <div className="text-(--brand-on-surface)">
      <section className="mx-auto w-full max-w-6xl px-6 pt-28 pb-14 sm:pt-32 sm:pb-18">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div className="text-center">
            <p className="text-sm font-semibold tracking-[0.22em] text-(--primary) uppercase">
              {t("technology.label")}
            </p>
            <h1 className="mx-auto mt-4 max-w-4xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              {t("technology.heading")}
            </h1>
            <p className="mx-auto mt-6 max-w-4xl text-left text-base leading-8 text-white/78 sm:text-lg">
              {t("technology.intro")}
            </p>
            <p className="mx-auto mt-6 max-w-4xl text-left text-base leading-8 font-semibold text-white sm:text-lg">
              {t("technology.introStrong")}
            </p>
          </div>

          <aside className="bento-card rounded-3xl p-6 text-center sm:p-7">
            <p className="text-xs font-semibold tracking-[0.18em] text-(--accent) uppercase">
              {t("technology.beliefLabel")}
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              {t("technology.beliefTitle")}
            </h2>
            <p className="mt-4 text-left text-sm leading-7 text-white/78 sm:text-base">
              {t("technology.beliefText")}
            </p>
          </aside>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 pb-16 sm:pb-20" data-reveal>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold tracking-[0.22em] text-(--color-secondary-warm) uppercase">
            {t("technology.stackLabel")}
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {t("technology.stackTitle")}
          </h2>
          <p className="mt-4 text-left text-base leading-8 text-white/78 sm:text-lg">
            {t("technology.stackIntro")}
          </p>
        </div>

        <div className="mt-8 grid gap-5 xl:grid-cols-2">
          {cards.map((card) => (
            <TechnologyStackCard key={card.name} {...card} />
          ))}
        </div>

        <div className="mt-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold tracking-[0.22em] text-(--accent) uppercase">
              {t("technology.proof.label")}
            </p>
            <h3 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              {t("technology.proof.title")}
            </h3>
            <p className="mt-5 text-left text-base leading-8 text-white/78 sm:text-lg">
              {t("technology.proof.intro")}
            </p>
          </div>
          <ul className="mt-6 grid gap-4 text-sm leading-7 text-white/78 sm:text-base lg:grid-cols-2">
            {PROOF_ITEMS.map(({ key, Icon }) => (
              <li key={key} className="fancy-card rounded-2xl p-5">
                <div className="flex gap-4">
                  <span className="fancy-tile flex size-11 shrink-0 items-center justify-center rounded-xl">
                    <Icon className="size-5 text-(--accent)" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="mt-1 text-sm font-semibold tracking-[0.16em] text-(--accent) uppercase">
                      {t(`technology.proof.items.${key}.title` as const)}
                    </p>
                    <p className="mt-3">{t(`technology.proof.items.${key}.text` as const)}</p>
                    {key === "verifiable" ? (
                      <a
                        href={localizePath("/projects", lang)}
                        className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-(--accent) transition-colors hover:text-(--primary)"
                      >
                        {t("technology.proof.projectsLink")}
                        <span aria-hidden="true">→</span>
                      </a>
                    ) : null}
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="fancy-card mx-auto mt-8 max-w-3xl rounded-3xl p-6 sm:p-8">
            <h4 className="fancy-eyebrow text-xl font-semibold tracking-tight text-white sm:text-2xl">
              {t("technology.proof.valueTitle")}
            </h4>
            <p className="mt-4 text-base leading-8 text-slate-200 sm:text-lg">
              <Trans i18nKey="technology.proof.valueText" components={brandComponents} />
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 pb-16 sm:pb-20" data-reveal>
        <div className="fancy-card mx-auto max-w-3xl rounded-3xl p-6 text-center sm:p-10">
          <p className="fancy-eyebrow text-sm font-semibold tracking-[0.22em] text-(--color-secondary-warm) uppercase">
            {t("technology.llmLabel")}
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {t("technology.llmTitle")}
          </h2>
          <p className="mt-5 text-left text-base leading-8 text-slate-200 sm:text-lg">
            {t("technology.llmText")}
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 pb-16 sm:pb-20" data-reveal>
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-6 text-center">
          <p className="text-sm font-semibold tracking-[0.24em] text-(--color-secondary-hot) uppercase">
            {t("technology.cta.eyebrow")}
          </p>
          <h2 className="max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {t("technology.cta.title")}
          </h2>
          <p className="w-full max-w-3xl text-left text-base leading-8 text-slate-200 sm:text-lg">
            {t("technology.cta.text")}
          </p>
          <ConversionCtaButton
            href={contactHref}
            ariaLabel={t("technology.cta.ariaLabel")}
            onClick={() => trackEvent("quote_cta_click", { location: "technology" })}
          >
            {t("technology.cta.button")}
          </ConversionCtaButton>
        </div>
      </section>
    </div>
  );
}
