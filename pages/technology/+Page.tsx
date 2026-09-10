import { Trans, useTranslation } from "react-i18next";
import { usePageContext } from "vike-react/usePageContext";
import { ConversionCtaButton } from "@/components/ConversionCtaButton";
import { PageHeroBackground } from "@/components/PageHeroBackground";
import { TechnologyStackCard } from "@/components/TechnologyStackCard";
import { DEFAULT_LANG, type SupportedLang } from "@/src/i18n-config";
import { localizePath } from "@/src/localizedRoutes";
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

const TRUSTED_COMPANY_KEYS = ["react", "tailwind", "backend", "database"] as const;

type TrustedCompanyKey = (typeof TRUSTED_COMPANY_KEYS)[number];

export default function Page() {
  const pageContext = usePageContext() as { lang?: SupportedLang };
  const lang = pageContext.lang ?? DEFAULT_LANG;
  const contactHref = localizePath("/contact", lang);
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
    brandNetflix: (
      <BrandWord className="font-semibold tracking-[0.08em] text-[#e50914] uppercase" />
    ),
    brandNetflixPlain: <BrandWord className="font-semibold text-white uppercase" />,
    brandInstagram: (
      <BrandWord className="bg-[linear-gradient(135deg,#feda75,#fa7e1e,#d62976,#962fbf,#4f5bd5)] bg-clip-text font-semibold text-transparent" />
    ),
    brandInstagramPlain: <BrandWord className="font-semibold text-white" />,
    brandOpenAI: <BrandWord className="font-semibold text-white" />,
    brandOpenAIPlain: <BrandWord className="font-semibold text-white" />,
    brandChatGPT: <BrandWord className="font-semibold text-[#10a37f]" />,
    brandChatGPTPlain: <BrandWord className="font-semibold text-white" />,
    brandNASA: <BrandWord className="font-semibold tracking-[0.08em] text-[#7dc6ff] uppercase" />,
    brandNASAPlain: <BrandWord className="font-semibold text-white uppercase" />,
    brandSpotify: <BrandWord className="font-semibold text-[#1ed760]" />,
    brandSpotifyPlain: <BrandWord className="font-semibold text-white" />,
    brandApple: <BrandWord className="font-semibold text-white" />,
    brandApplePlain: <BrandWord className="font-semibold text-white" />,
    brandUber: <BrandWord className="font-semibold tracking-[0.04em] text-slate-200" />,
    brandUberPlain: <BrandWord className="font-semibold text-white" />,
    strong: <strong className="font-semibold text-white" />,
  };

  return (
    <div className="text-(--brand-on-surface)">
      <PageHeroBackground />
      <section className="mx-auto w-full max-w-6xl px-6 pt-28 pb-14 sm:pt-32 sm:pb-18">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div className="text-center">
            <p className="text-sm font-semibold tracking-[0.22em] text-(--primary) uppercase">
              {t("technology.label")}
            </p>
            <h1 className="mx-auto mt-4 max-w-4xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              {t("technology.heading")}
            </h1>
            <p className="mx-auto mt-6 max-w-4xl text-base leading-8 text-white/78 sm:text-lg">
              {t("technology.intro")}
            </p>
            <p className="mx-auto mt-6 max-w-4xl text-base leading-8 font-semibold text-white sm:text-lg">
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
            <p className="mt-4 text-sm leading-7 text-white/78 sm:text-base">
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
          <p className="mt-4 text-base leading-8 text-white/78 sm:text-lg">
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
              {t("technology.trustedCompanies.label")}
            </p>
            <h3 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              {t("technology.trustedCompanies.title")}
            </h3>
            <p className="mt-5 text-base leading-8 text-white/78 sm:text-lg">
              {t("technology.trustedCompanies.intro")}
            </p>
          </div>
          <ul className="mt-6 grid gap-4 text-sm leading-7 text-white/78 sm:text-base">
            {TRUSTED_COMPANY_KEYS.map((itemKey) => (
              <li key={itemKey} className="rounded-2xl border border-white/10 bg-white/4 p-5">
                <div className="flex gap-4">
                  <span className="mt-1 size-2.5 shrink-0 rounded-full bg-(--accent) shadow-[0_0_18px_var(--accent-glow)]" />
                  <div>
                    <p className="text-sm font-semibold tracking-[0.16em] text-(--accent) uppercase">
                      {t(`technology.trustedCompanies.itemTitles.${itemKey}` as const)}
                    </p>
                    <p className="mt-3">
                      <Trans
                        i18nKey={`technology.trustedCompanies.items.${itemKey}`}
                        components={brandComponents}
                      />
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="mx-auto mt-8 max-w-3xl text-center">
            <h4 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
              {t("technology.trustedCompanies.valueTitle")}
            </h4>
            <p className="mt-4 text-base leading-8 text-slate-200 sm:text-lg">
              <Trans i18nKey="technology.trustedCompanies.valueText" components={brandComponents} />
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 pb-16 sm:pb-20" data-reveal>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold tracking-[0.22em] text-(--color-secondary-warm) uppercase">
            {t("technology.llmLabel")}
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {t("technology.llmTitle")}
          </h2>
          <p className="mt-5 text-base leading-8 text-slate-200 sm:text-lg">
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
