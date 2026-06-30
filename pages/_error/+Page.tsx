import { useTranslation } from "react-i18next";
import { usePageContext } from "vike-react/usePageContext";
import { DEFAULT_LANG, type SupportedLang } from "@/src/i18n-config";

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
  const homeHref = `/${lang}/`;
  const contactHref = `/${lang}/contact`;
  const is404 = statusCode === 404;
  const title = is404 ? t("errorPage.title404") : t("errorPage.titleDefault");
  const text = is404 ? t("errorPage.text404") : t("errorPage.textDefault");

  return (
    <main className="relative overflow-hidden pt-28 pb-16 sm:pt-32 sm:pb-20">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,color-mix(in_oklab,var(--color-secondary-hot),transparent_78%)_0%,transparent_40%),radial-gradient(circle_at_82%_8%,color-mix(in_oklab,var(--color-secondary-warm),transparent_80%)_0%,transparent_46%)]" />

      <section className="relative mx-auto w-full max-w-4xl px-6">
        <article className="rounded-3xl border border-white/12 bg-[linear-gradient(155deg,rgba(16,22,42,0.9),rgba(10,15,28,0.94))] p-7 shadow-[0_24px_70px_-42px_var(--accent-glow)] sm:p-10">
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

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={homeHref}
              className="inline-flex items-center rounded-xl border border-white/14 bg-white/7 px-5 py-3 text-sm font-semibold tracking-[0.08em] text-white uppercase transition-colors hover:bg-white/12"
            >
              {t("errorPage.primaryButton")}
            </a>
            <a
              href={contactHref}
              className="inline-flex items-center rounded-xl border border-transparent bg-[linear-gradient(120deg,var(--color-secondary-warm),var(--color-secondary-hot)_62%,var(--color-secondary-warm))] px-5 py-3 text-sm font-extrabold tracking-[0.08em] text-[#16090e] uppercase transition-transform hover:-translate-y-0.5"
            >
              {t("errorPage.secondaryButton")}
            </a>
          </div>
        </article>
      </section>
    </main>
  );
}
