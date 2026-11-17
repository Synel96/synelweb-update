import { SparklesIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useHufFormatter } from "@/src/currency";
import { ADS_SETUP_PRICE_HUF } from "@/src/pricing";
import { quoteFormHref } from "@/src/quoteForm";
import type { AppLang } from "@/src/services/serviceCardsService";

// The website + Google Ads bundle offer: ordered together, the ad account
// setup (ADS_SETUP_PRICE_HUF) is free. Runs until withdrawn.
export function BundleOffer({ lang, className = "" }: { lang: AppLang; className?: string }) {
  const { t } = useTranslation();
  const formatHuf = useHufFormatter(lang);

  return (
    <aside
      className={`fancy-card mx-auto flex max-w-3xl flex-col items-start gap-4 rounded-2xl p-5 sm:flex-row sm:items-center sm:p-6 ${className}`}
    >
      <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-linear-135 from-(--color-secondary-warm) to-(--color-accent) text-[#140814] shadow-[0_10px_24px_-12px_var(--accent-glow)]">
        <SparklesIcon className="size-5" aria-hidden="true" />
      </span>
      <div className="flex-1">
        <p className="text-xs font-semibold tracking-[0.18em] text-(--accent) uppercase">
          {t("bundleOffer.label")}
        </p>
        <p className="mt-1 text-base font-semibold text-white sm:text-lg">
          {t("bundleOffer.title")}
        </p>
        <p className="mt-1 text-sm leading-7 text-white/78">
          {t("bundleOffer.text", { price: formatHuf(ADS_SETUP_PRICE_HUF) })}
        </p>
      </div>
      <a
        href={quoteFormHref(lang)}
        className="shrink-0 text-sm font-semibold tracking-[0.08em] text-(--accent) uppercase transition-colors hover:text-(--primary)"
      >
        {t("bundleOffer.cta")}
      </a>
    </aside>
  );
}
