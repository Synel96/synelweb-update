import { usePageContext } from "vike-react/usePageContext";
import { useTranslation } from "react-i18next";
import { AboutProfileAvatar } from "@/components/AboutProfileAvatar";
import { ConversionCtaButton } from "@/components/ConversionCtaButton";
import { DEFAULT_LANG, type SupportedLang } from "@/src/i18n-config";

type InfoItem = {
  title: string;
  content: string;
};

function readInfoItems(value: unknown): InfoItem[] {
  if (!Array.isArray(value)) return [];

  return value
    .filter(
      (item): item is { title?: unknown; content?: unknown } =>
        typeof item === "object" && item !== null
    )
    .map((item) => ({
      title: String(item.title ?? ""),
      content: String(item.content ?? ""),
    }))
    .filter((item) => item.title.length > 0 && item.content.length > 0);
}

export default function Page() {
  const pageContext = usePageContext() as { lang?: SupportedLang };
  const lang = pageContext.lang ?? DEFAULT_LANG;
  const contactHref = `/${lang}/contact`;
  const { t } = useTranslation();
  const accordionItems = readInfoItems(t("about.accordion.items", { returnObjects: true }));
  const processCards = readInfoItems(t("about.process.cards", { returnObjects: true }));

  return (
    <div className="text-(--brand-on-surface)">
      <section className="mx-auto grid w-full max-w-6xl gap-10 px-6 pt-28 pb-16 sm:pt-32 sm:pb-20 lg:grid-cols-[1.35fr_0.65fr] lg:items-center">
        <div>
          <p className="text-sm font-semibold tracking-[0.2em] text-(--primary) uppercase">
            {t("about.label")}
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
            {t("about.heading")}
          </h1>
          <p className="mt-6 max-w-4xl text-base leading-8 text-white/78 sm:text-lg">
            {t("about.intro")}
          </p>
          <p className="mt-6 max-w-4xl text-base leading-8 font-semibold text-(--brand-on-surface) sm:text-lg">
            {t("about.introStrong")}
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <article className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs font-semibold tracking-[0.14em] text-(--accent) uppercase">
                {t("about.highlights.speed.title")}
              </p>
              <p className="mt-2 text-sm text-white/80">{t("about.highlights.speed.text")}</p>
            </article>
            <article className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs font-semibold tracking-[0.14em] text-(--accent) uppercase">
                {t("about.highlights.security.title")}
              </p>
              <p className="mt-2 text-sm text-white/80">{t("about.highlights.security.text")}</p>
            </article>
            <article className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs font-semibold tracking-[0.14em] text-(--accent) uppercase">
                {t("about.highlights.custom.title")}
              </p>
              <p className="mt-2 text-sm text-white/80">{t("about.highlights.custom.text")}</p>
            </article>
          </div>
        </div>

        <AboutProfileAvatar alt={t("about.avatarAlt")} />
      </section>

      <section className="mx-auto w-full max-w-6xl rounded-2xl border border-white/10 bg-[linear-gradient(150deg,rgba(16,22,42,0.86),rgba(15,21,40,0.92))] px-4 py-5 sm:px-6 sm:py-6">
        <h2 className="px-2 text-xl font-semibold sm:text-2xl">{t("about.accordion.title")}</h2>
        <div className="mt-4 space-y-3">
          {accordionItems.map((item) => (
            <details
              key={item.title}
              className="group rounded-xl border border-white/10 bg-white/4 p-4 open:bg-white/6"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-base font-semibold text-(--brand-on-surface) sm:text-lg">
                <span>{item.title}</span>
                <span className="text-2xl leading-none text-(--accent) transition-transform duration-200 group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm leading-7 text-white/75 sm:text-base">{item.content}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-16 sm:py-20">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {t("about.process.title")}
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {processCards.map((item) => (
            <article key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-white/78 sm:text-base">{item.content}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-white/10 bg-[linear-gradient(140deg,rgba(11,15,25,0.92),rgba(15,21,40,0.96))]">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-16 sm:py-20">
          <p className="text-sm font-semibold tracking-[0.24em] text-(--accent) uppercase">
            {t("about.cta.eyebrow")}
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {t("about.cta.title")}
          </h2>
          <p className="max-w-3xl text-base leading-8 text-slate-200 sm:text-lg">
            {t("about.cta.text")}
          </p>
          <ConversionCtaButton href={contactHref} ariaLabel={t("about.cta.ariaLabel")}>
            {t("about.cta.button")}
          </ConversionCtaButton>
        </div>
      </section>
    </div>
  );
}
