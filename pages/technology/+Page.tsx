import { useTranslation } from "react-i18next";
import { usePageContext } from "vike-react/usePageContext";
import { ConversionCtaButton } from "@/components/ConversionCtaButton";
import { TechnologyStackCard } from "@/components/TechnologyStackCard";
import { DEFAULT_LANG, type SupportedLang } from "@/src/i18n-config";
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

export default function Page() {
  const pageContext = usePageContext() as { lang?: SupportedLang };
  const lang = pageContext.lang ?? DEFAULT_LANG;
  const contactHref = `/${lang}/contact`;
  const { t } = useTranslation();
  const cards = readTechnologyCards(t("technology.cards", { returnObjects: true }));

  return (
    <div className="text-(--brand-on-surface)">
      <section className="mx-auto w-full max-w-6xl px-6 pt-28 pb-14 sm:pt-32 sm:pb-18">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold tracking-[0.22em] text-(--primary) uppercase">
              {t("technology.label")}
            </p>
            <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              {t("technology.heading")}
            </h1>
            <p className="mt-6 max-w-4xl text-base leading-8 text-white/78 sm:text-lg">
              {t("technology.intro")}
            </p>
            <p className="mt-6 max-w-4xl text-base leading-8 font-semibold text-white sm:text-lg">
              {t("technology.introStrong")}
            </p>
          </div>

          <aside className="bento-card rounded-3xl p-6 sm:p-7">
            <p className="text-xs font-semibold tracking-[0.18em] text-(--accent) uppercase">
              {t("technology.beliefLabel")}
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              {t("technology.beliefTitle")}
            </h2>
            <p className="mt-4 text-sm leading-7 text-white/78 sm:text-base">
              {t("technology.beliefText")}
            </p>
          </aside>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 pb-16 sm:pb-20">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold tracking-[0.22em] text-(--accent) uppercase">
            {t("technology.stackLabel")}
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {t("technology.stackTitle")}
          </h2>
          <p className="mt-4 text-base leading-8 text-white/78 sm:text-lg">
            {t("technology.stackIntro")}
          </p>
        </div>

        <div className="mt-8 grid gap-5 xl:grid-cols-2">
          {cards.map((card) => (
            <TechnologyStackCard key={card.name} {...card} />
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 pb-16 sm:pb-20">
        <div className="rounded-3xl border border-white/10 bg-[linear-gradient(145deg,rgba(11,15,25,0.95),rgba(15,21,40,0.98))] p-7 shadow-[0_30px_70px_-36px_rgba(0,0,0,0.75)] sm:p-9">
          <p className="text-sm font-semibold tracking-[0.22em] text-(--accent) uppercase">
            {t("technology.llmLabel")}
          </p>
          <h2 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {t("technology.llmTitle")}
          </h2>
          <p className="mt-5 max-w-4xl text-base leading-8 text-slate-200 sm:text-lg">
            {t("technology.llmText")}
          </p>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[linear-gradient(140deg,rgba(11,15,25,0.92),rgba(15,21,40,0.96))]">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-16 sm:py-20">
          <p className="text-sm font-semibold tracking-[0.24em] text-(--accent) uppercase">
            {t("technology.cta.eyebrow")}
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {t("technology.cta.title")}
          </h2>
          <p className="max-w-3xl text-base leading-8 text-slate-200 sm:text-lg">
            {t("technology.cta.text")}
          </p>
          <ConversionCtaButton href={contactHref} ariaLabel={t("technology.cta.ariaLabel")}>
            {t("technology.cta.button")}
          </ConversionCtaButton>
        </div>
      </section>
    </div>
  );
}
