import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import {
  AccessibilityIcon,
  ArrowRightIcon,
  CpuIcon,
  FileDownIcon,
  FileSearchIcon,
  GaugeIcon,
  LayersIcon,
  LightbulbIcon,
  LoaderCircleIcon,
  MonitorIcon,
  SearchIcon,
  ShieldCheckIcon,
  SmartphoneIcon,
  ZapIcon,
  type LucideIcon,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { usePageContext } from "vike-react/usePageContext";
import { ConversionCtaButton } from "@/components/ConversionCtaButton";
import { LighthouseScoreRing } from "@/components/LighthouseScoreRing";
import { trackEvent } from "@/src/analytics";
import { DEFAULT_LANG, type SupportedLang } from "@/src/i18n-config";
import { localizePath } from "@/src/localizedRoutes";
import { prefersReducedMotion } from "@/src/prefersReducedMotion";
import { quoteFormHref } from "@/src/quoteForm";
import {
  runSiteCheck,
  SiteCheckFailure,
  type SiteCheckError,
  type SiteCheckResult,
  type SiteCheckStrategy,
} from "@/src/services/siteCheckService";
import type { AppLang } from "@/src/services/serviceCardsService";
import { storeSiteCheck } from "@/src/siteCheckStorage";
import { JsonLd } from "@/components/JsonLd";
import { SiteCheckAudit, SiteCheckPlatform } from "@/components/SiteCheckAudit";
import { SITE_URL } from "@/components/site";
import { getSeoEntry } from "@/src/seo";
import { buildWebApplicationJsonLd } from "@/src/structuredData";

const SCORE_KEYS = ["performance", "accessibility", "bestPractices", "seo"] as const;
const ABOUT_ICONS: Record<(typeof SCORE_KEYS)[number], LucideIcon> = {
  performance: ZapIcon,
  accessibility: AccessibilityIcon,
  bestPractices: ShieldCheckIcon,
  seo: SearchIcon,
};
// What the check adds beyond the four Lighthouse scores.
const EXTRA_ABOUT: Array<{ key: "seoBasics" | "tech" | "platform"; Icon: LucideIcon }> = [
  { key: "seoBasics", Icon: FileSearchIcon },
  { key: "tech", Icon: CpuIcon },
  { key: "platform", Icon: LayersIcon },
];
const PROGRESS_STEP_MS = 7000;

function hostOf(url: string) {
  try {
    return new URL(url).host.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function formatSeconds(ms: number, lang: AppLang) {
  return (ms / 1000).toLocaleString(lang === "en" ? "en-US" : lang === "de" ? "de-DE" : "hu-HU", {
    maximumFractionDigits: 1,
  });
}

// Real-user values in the unit people know: seconds for LCP, ms for INP,
// and CLS from its x100 integer.
function formatField(id: "lcp" | "inp" | "cls", percentile: number, lang: AppLang) {
  if (id === "lcp") return `${formatSeconds(percentile, lang)} s`;
  if (id === "inp") return `${percentile} ms`;
  return (percentile / 100).toLocaleString(lang === "en" ? "en-US" : "hu-HU", {
    maximumFractionDigits: 2,
  });
}

const CATEGORY_CLASS: Record<string, string> = {
  FAST: "text-emerald-300 border-emerald-300/40 bg-emerald-400/10",
  AVERAGE: "text-amber-300 border-amber-300/40 bg-amber-400/10",
  SLOW: "text-rose-300 border-rose-300/40 bg-rose-400/10",
};

export default function Page() {
  const { t } = useTranslation();
  const pageContext = usePageContext() as { lang?: SupportedLang };
  const lang = (pageContext.lang ?? DEFAULT_LANG) as AppLang;
  const inputId = useId();

  const [url, setUrl] = useState("");
  const [strategy, setStrategy] = useState<SiteCheckStrategy>("mobile");
  const [isChecking, setIsChecking] = useState(false);
  const [progressIndex, setProgressIndex] = useState(0);
  const [error, setError] = useState<SiteCheckError | null>(null);
  const [result, setResult] = useState<SiteCheckResult | null>(null);
  const [checkedAt, setCheckedAt] = useState<Date | null>(null);
  const [isMakingPdf, setIsMakingPdf] = useState(false);
  const [pdfFailed, setPdfFailed] = useState(false);
  const resultRef = useRef<HTMLDivElement | null>(null);

  const didYouKnowRaw = t("siteCheck.didYouKnow.items", { returnObjects: true }) as unknown;
  const didYouKnow = Array.isArray(didYouKnowRaw) ? (didYouKnowRaw as string[]) : [];
  const progress = t("siteCheck.progress", { returnObjects: true }) as unknown;
  const progressSteps = Array.isArray(progress) ? (progress as string[]) : [];

  // Moves the progress text along while the check runs (it has no real
  // progress to report), stopping at the last step.
  useEffect(() => {
    if (!isChecking) return;
    setProgressIndex(0);
    const timer = window.setInterval(() => {
      setProgressIndex((index) => Math.min(index + 1, Math.max(progressSteps.length - 1, 0)));
    }, PROGRESS_STEP_MS);
    return () => window.clearInterval(timer);
  }, [isChecking, progressSteps.length]);

  useEffect(() => {
    if (!result) return;
    resultRef.current?.scrollIntoView({
      block: "start",
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
    resultRef.current?.focus({ preventScroll: true });
  }, [result]);

  const check = async (
    target: string,
    device: SiteCheckStrategy,
    trigger: "form" | "other_device" = "form"
  ) => {
    if (!target.trim() || isChecking) return;
    trackEvent("site_check_start", { strategy: device, trigger });
    setIsChecking(true);
    setError(null);
    setStrategy(device);
    try {
      const next = await runSiteCheck(target.trim(), device, lang);
      setResult(next);
      setCheckedAt(new Date());
      // Kept for the quote form, which offers to attach it.
      storeSiteCheck(next);
      trackEvent("site_check_run", { strategy: device, result: "success" });
    } catch (failure) {
      const reason = failure instanceof SiteCheckFailure ? failure.reason : "busy";
      setError(reason);
      trackEvent("site_check_run", { strategy: device, result: "error", reason });
    } finally {
      setIsChecking(false);
    }
  };

  const downloadPdf = async () => {
    if (!result || isMakingPdf) return;
    setIsMakingPdf(true);
    setPdfFailed(false);
    try {
      const { downloadSiteCheckReport } = await import("@/src/siteCheckReport");
      await downloadSiteCheckReport(result, t, lang, checkedAt ?? new Date());
      trackEvent("site_check_pdf", { strategy: result.strategy });
    } catch {
      setPdfFailed(true);
    } finally {
      setIsMakingPdf(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void check(url, strategy);
  };

  const otherDevice: SiteCheckStrategy = result?.strategy === "mobile" ? "desktop" : "mobile";
  const performance = result?.scores.performance ?? null;
  const verdict =
    performance === null
      ? null
      : performance >= 90
        ? "good"
        : performance >= 50
          ? "average"
          : "poor";

  const seo = getSeoEntry("/site-check", lang);

  return (
    <>
      <JsonLd
        data={buildWebApplicationJsonLd({
          url: new URL(localizePath("/site-check", lang), SITE_URL).toString(),
          name: t("siteCheck.label"),
          description: seo.description,
          lang,
        })}
      />
      <section className="mx-auto w-full max-w-4xl px-6 pt-36 pb-10 text-center sm:pt-40 sm:pb-14">
        <p className="fancy-eyebrow text-xs font-semibold tracking-[0.2em] text-(--accent) uppercase">
          {t("siteCheck.label")}
        </p>
        <h1 className="mx-auto mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-balance text-white sm:text-5xl">
          {t("siteCheck.title")}
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-pretty text-white/78 sm:text-lg">
          {t("siteCheck.intro")}
        </p>

        <form
          onSubmit={handleSubmit}
          className="fancy-card mx-auto mt-8 max-w-2xl rounded-3xl p-4 text-left sm:p-5"
          aria-busy={isChecking}
        >
          <label htmlFor={inputId} className="sr-only">
            {t("siteCheck.urlLabel")}
          </label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              id={inputId}
              type="text"
              inputMode="url"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              maxLength={500}
              required
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              placeholder={t("siteCheck.urlPlaceholder")}
              className="min-w-0 flex-1 rounded-xl border border-white/15 bg-black/25 px-4 py-3 text-base text-white placeholder:text-white/40 focus:border-(--accent) focus:outline-none"
            />
            <button
              type="submit"
              disabled={isChecking}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-(--color-secondary-warm) to-(--accent) px-6 py-3 text-sm font-bold text-[#140814] transition-transform hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-70"
            >
              {isChecking ? (
                <LoaderCircleIcon className="size-4 animate-spin" aria-hidden="true" />
              ) : (
                <GaugeIcon className="size-4" aria-hidden="true" />
              )}
              {isChecking ? t("siteCheck.checking") : t("siteCheck.submit")}
            </button>
          </div>
          <fieldset className="mt-3 flex items-center gap-2">
            <legend className="sr-only">{t("siteCheck.strategy.label")}</legend>
            {(["mobile", "desktop"] as const).map((device) => {
              const Icon = device === "mobile" ? SmartphoneIcon : MonitorIcon;
              const isActive = strategy === device;
              return (
                <label
                  key={device}
                  className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors has-focus-visible:outline-2 has-focus-visible:outline-(--ring) ${
                    isActive
                      ? "border-(--accent)/70 bg-(--accent)/15 text-white"
                      : "border-white/15 text-white/70 hover:border-white/30"
                  }`}
                >
                  <input
                    type="radio"
                    name={`${inputId}-strategy`}
                    value={device}
                    checked={isActive}
                    onChange={() => setStrategy(device)}
                    disabled={isChecking}
                    className="sr-only"
                  />
                  <Icon className="size-4" aria-hidden="true" />
                  {t(`siteCheck.strategy.${device}`)}
                </label>
              );
            })}
          </fieldset>
        </form>

        <div aria-live="polite" className="mx-auto mt-5 max-w-2xl">
          {isChecking ? (
            <div className="text-sm text-white/75">
              <p className="font-medium text-white">{progressSteps[progressIndex] ?? ""}</p>
              <p className="mt-1 text-white/55">{t("siteCheck.progressHint")}</p>
            </div>
          ) : null}
          {error ? (
            <p
              role="alert"
              className="rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-100"
            >
              {t(`siteCheck.errors.${error}`)}
            </p>
          ) : null}
        </div>
      </section>

      {result ? (
        <section className="mx-auto w-full max-w-5xl px-6 pb-16 sm:pb-20">
          <div
            ref={resultRef}
            tabIndex={-1}
            className="fancy-card scroll-mt-28 rounded-3xl p-6 outline-none sm:p-8"
          >
            <p className="text-xs font-semibold tracking-[0.18em] text-(--color-secondary-warm) uppercase">
              {t("siteCheck.resultTitle")}
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight break-words text-white sm:text-3xl">
              {t("siteCheck.resultFor", {
                host: hostOf(result.finalUrl || result.url),
                device: t(`siteCheck.strategy.${result.strategy}`),
              })}
            </h2>
            {verdict ? (
              <p className="mt-2 text-base text-white/78">{t(`siteCheck.verdict.${verdict}`)}</p>
            ) : null}

            <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {SCORE_KEYS.map((key) => (
                <li key={key} className="flex justify-center">
                  <LighthouseScoreRing
                    label={t(`siteCheck.scores.${key}`)}
                    score={result.scores[key] ?? 0}
                  />
                </li>
              ))}
            </ul>

            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              <div>
                <h3 className="text-lg font-semibold text-white">{t("siteCheck.fieldTitle")}</h3>
                {result.field.length > 0 ? (
                  <>
                    <p className="mt-1 text-xs text-white/55">{t("siteCheck.fieldHint")}</p>
                    <ul className="mt-3 space-y-2">
                      {result.field.map((metric) => (
                        <li
                          key={metric.id}
                          className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/4 px-4 py-3 text-sm"
                        >
                          <span className="text-white/80">
                            {t(`siteCheck.fieldMetrics.${metric.id}`)}
                          </span>
                          <span className="flex shrink-0 items-center gap-2">
                            <span className="font-semibold whitespace-nowrap text-white">
                              {formatField(metric.id, metric.percentile, lang)}
                            </span>
                            {metric.category ? (
                              <span
                                className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${
                                  CATEGORY_CLASS[metric.category] ?? "border-white/15 text-white/70"
                                }`}
                              >
                                {t(`siteCheck.fieldCategory.${metric.category}`, {
                                  defaultValue: metric.category,
                                })}
                              </span>
                            ) : null}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <p className="mt-2 text-sm leading-6 text-white/65">{t("siteCheck.fieldNone")}</p>
                )}

                {result.lab.length > 0 ? (
                  <>
                    <h3 className="mt-6 text-lg font-semibold text-white">
                      {t("siteCheck.labTitle")}
                    </h3>
                    <ul className="mt-3 divide-y divide-white/10 rounded-xl border border-white/10 bg-white/4 px-4">
                      {result.lab.map((metric) => (
                        <li key={metric.id} className="flex justify-between gap-3 py-2.5 text-sm">
                          <span className="text-white/75">{metric.title}</span>
                          <span
                            className={`font-semibold ${
                              metric.score === null
                                ? "text-white"
                                : metric.score >= 0.9
                                  ? "text-emerald-300"
                                  : metric.score >= 0.5
                                    ? "text-amber-300"
                                    : "text-rose-300"
                            }`}
                          >
                            {metric.value}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : null}
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white">
                  {t("siteCheck.opportunitiesTitle")}
                </h3>
                {result.opportunities.length > 0 ? (
                  <ol className="mt-3 space-y-2">
                    {result.opportunities.map((item) => (
                      <li
                        key={item.id}
                        className="rounded-xl border border-white/10 bg-white/4 px-4 py-3 text-sm"
                      >
                        <p className="font-medium text-white">{item.title}</p>
                        <p className="mt-1 text-xs font-semibold text-amber-300">
                          {item.savingsMs >= 100
                            ? t("siteCheck.savings", {
                                seconds: formatSeconds(item.savingsMs, lang),
                              })
                            : (item.clsSavings ?? 0) > 0
                              ? t("siteCheck.clsSavings")
                              : t("siteCheck.genericSavings")}
                        </p>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p className="mt-2 text-sm text-white/65">
                    {/* Only praise a page that actually scores well. */}
                    {(performance ?? 0) >= 90
                      ? t("siteCheck.noOpportunities")
                      : t("siteCheck.noOpportunitiesWeak")}
                  </p>
                )}
              </div>
            </div>

            {result.seo === null ? (
              <p className="mt-8 border-t border-white/10 pt-6 text-sm text-white/65">
                {t("siteCheck.audit.seoUnavailable")}
              </p>
            ) : result.seo ? (
              <>
                {result.seo.platform ? <SiteCheckPlatform platform={result.seo.platform} /> : null}
                <SiteCheckAudit
                  group="seo"
                  items={result.seo.checks}
                  lang={lang}
                  note={result.seo.clientRendered ? t("siteCheck.audit.clientRendered") : undefined}
                />
              </>
            ) : null}
            {result.tech && result.tech.length > 0 ? (
              <SiteCheckAudit group="tech" items={result.tech} lang={lang} />
            ) : null}

            <div className="mt-6 flex flex-wrap gap-3 border-t border-white/10 pt-5">
              <button
                type="button"
                onClick={() => void downloadPdf()}
                disabled={isMakingPdf}
                className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-(--color-secondary-warm) to-(--accent) px-4 py-2.5 text-sm font-bold text-[#140814] transition-transform hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-70"
              >
                {isMakingPdf ? (
                  <LoaderCircleIcon className="size-4 animate-spin" aria-hidden="true" />
                ) : (
                  <FileDownIcon className="size-4" aria-hidden="true" />
                )}
                {isMakingPdf ? t("siteCheck.pdf.generating") : t("siteCheck.pdf.button")}
              </button>
              <button
                type="button"
                onClick={() => void check(result.url, otherDevice, "other_device")}
                disabled={isChecking}
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2.5 text-sm font-semibold text-white/85 transition-colors hover:border-white/30 hover:text-white disabled:opacity-60"
              >
                {otherDevice === "mobile" ? (
                  <SmartphoneIcon className="size-4" aria-hidden="true" />
                ) : (
                  <MonitorIcon className="size-4" aria-hidden="true" />
                )}
                {t("siteCheck.otherDevice", {
                  device: t(`siteCheck.strategy.${otherDevice}`).toLowerCase(),
                })}
              </button>
              {pdfFailed ? (
                <p role="alert" className="w-full text-sm text-red-200">
                  {t("siteCheck.pdf.failed")}
                </p>
              ) : null}
            </div>
          </div>

          <div className="fancy-card mt-6 flex flex-col items-start gap-6 rounded-3xl p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-semibold tracking-tight text-balance text-white">
                {t("siteCheck.cta.title")}
              </h2>
              <p className="mt-2 text-base leading-7 text-white/75">{t("siteCheck.cta.text")}</p>
              <a
                href={localizePath("/projects", lang)}
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-(--accent) hover:text-(--primary)"
              >
                {t("siteCheck.cta.projects")}
                <ArrowRightIcon className="size-4" aria-hidden="true" />
              </a>
            </div>
            <ConversionCtaButton
              href={quoteFormHref(lang, undefined, { site: result.url })}
              onClick={() => trackEvent("quote_cta_click", { location: "site_check" })}
            >
              {t("siteCheck.cta.button")}
            </ConversionCtaButton>
          </div>
        </section>
      ) : null}

      <section className="mx-auto w-full max-w-5xl px-6 pb-12 sm:pb-16" data-reveal>
        <aside className="fancy-card rounded-3xl p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-linear-135 from-(--color-secondary-warm) to-(--accent) text-[#140814]">
              <LightbulbIcon className="size-5" aria-hidden="true" />
            </span>
            <h2 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
              {t("siteCheck.didYouKnow.title")}
            </h2>
          </div>
          <ul className="mt-5 space-y-3">
            {didYouKnow.map((fact) => (
              <li key={fact} className="flex gap-3 text-sm leading-7 text-white/82 sm:text-base">
                <SmartphoneIcon
                  className="mt-1.5 size-4 shrink-0 text-(--accent)"
                  aria-hidden="true"
                />
                <span>{fact}</span>
              </li>
            ))}
          </ul>
          <p className="mt-5 border-t border-white/10 pt-4 text-xs text-white/50">
            {t("siteCheck.didYouKnow.sources")}{" "}
            <a
              href="https://gs.statcounter.com/platform-market-share/desktop-mobile-tablet/hungary"
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-2 hover:text-white/80"
            >
              StatCounter
            </a>
            ,{" "}
            <a
              href="https://developers.google.com/search/blog/2023/10/mobile-first-is-here"
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-2 hover:text-white/80"
            >
              Google Search Central
            </a>
          </p>
        </aside>
      </section>

      <section className="mx-auto w-full max-w-5xl px-6 pb-20 sm:pb-24" data-reveal>
        <h2 className="text-center text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          {t("siteCheck.about.title")}
        </h2>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {SCORE_KEYS.map((key) => {
            const Icon = ABOUT_ICONS[key];
            return (
              <li key={key} className="fancy-card flex gap-4 rounded-2xl p-5">
                <span className="fancy-tile flex size-11 shrink-0 items-center justify-center rounded-xl">
                  <Icon className="size-5 text-(--accent)" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-semibold text-white">{t(`siteCheck.scores.${key}`)}</h3>
                  <p className="mt-1 text-sm leading-6 text-white/75">
                    {t(`siteCheck.about.items.${key}`)}
                  </p>
                </div>
              </li>
            );
          })}
          {EXTRA_ABOUT.map(({ key, Icon }) => (
            // The odd one out spans the row instead of leaving a gap.
            <li
              key={key}
              className={`fancy-card flex gap-4 rounded-2xl p-5 ${key === "platform" ? "sm:col-span-2" : ""}`}
            >
              <span className="fancy-tile flex size-11 shrink-0 items-center justify-center rounded-xl">
                <Icon className="size-5 text-(--accent)" aria-hidden="true" />
              </span>
              <div>
                <h3 className="font-semibold text-white">{t(`siteCheck.about.titles.${key}`)}</h3>
                <p className="mt-1 text-sm leading-6 text-white/75">
                  {t(`siteCheck.about.items.${key}`)}
                </p>
              </div>
            </li>
          ))}
        </ul>
        <p className="mx-auto mt-6 max-w-3xl text-center text-xs leading-5 text-white/50">
          {t("siteCheck.note")}
        </p>
      </section>
    </>
  );
}
