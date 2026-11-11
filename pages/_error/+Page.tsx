import { ConversionCtaButton } from "@/components/ConversionCtaButton";
import { useTranslation } from "react-i18next";
import { usePageContext } from "vike-react/usePageContext";
import { DEFAULT_LANG, type SupportedLang } from "@/src/i18n-config";
import { localizePath } from "@/src/localizedRoutes";

type ErrorPageContext = {
  abortStatusCode?: number;
  is404?: boolean;
  urlPathname?: string;
  lang?: SupportedLang;
};

export default function Page() {
  const { t } = useTranslation();
  const pageContext = usePageContext() as ErrorPageContext;
  const statusCode = pageContext.abortStatusCode ?? (pageContext.is404 ? 404 : 500);
  const pathname = pageContext.urlPathname ?? "/";
  const lang = pageContext.lang ?? DEFAULT_LANG;
  const homeHref = localizePath("/", lang);
  const contactHref = localizePath("/contact", lang);
  const is404 = statusCode === 404;
  const title = is404 ? t("errorPage.title404") : t("errorPage.titleDefault");
  const text = is404 ? t("errorPage.text404") : t("errorPage.textDefault");

  return (
    <main className="relative overflow-hidden pt-28 pb-16 sm:pt-32 sm:pb-20">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,color-mix(in_oklab,var(--color-secondary-hot),transparent_78%)_0%,transparent_40%),radial-gradient(circle_at_82%_8%,color-mix(in_oklab,var(--color-secondary-warm),transparent_80%)_0%,transparent_46%)]" />

      <section className="relative mx-auto w-full max-w-4xl px-6">
        <article className="fancy-card rounded-3xl p-7 sm:p-10">
          <p className="text-xs font-semibold tracking-[0.2em] text-(--accent) uppercase">
            {t("errorPage.eyebrow")}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center rounded-full border border-white/15 bg-white/6 px-4 py-1 text-sm font-semibold tracking-[0.08em] text-white">
              {t("errorPage.statusLabel")} {statusCode}
            </span>
            <span className="inline-flex items-center rounded-full border border-white/10 bg-black/25 px-4 py-1 text-xs text-white/72">
              {t("errorPage.pathLabel")} {pathname}
            </span>
          </div>

          <h1 className="mt-6 text-3xl leading-tight font-semibold tracking-tight text-white sm:text-4xl">
            {title}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-white/78 sm:text-lg">{text}</p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <ConversionCtaButton href={contactHref}>
              {t("errorPage.secondaryButton")}
            </ConversionCtaButton>
            <a
              href={homeHref}
              className="fancy-action inline-flex h-14 items-center rounded-full px-6 text-sm font-semibold tracking-[0.08em] text-white uppercase sm:h-15"
            >
              {t("errorPage.primaryButton")}
            </a>
          </div>
        </article>
      </section>
    </main>
  );
}
