import { useTranslation } from "react-i18next";
import { ConversionCtaButton } from "@/components/ConversionCtaButton";

type PageUnderDevelopmentProps = {
  sectionLabel: string;
  contactHref: string;
};

export function PageUnderDevelopment({ sectionLabel, contactHref }: PageUnderDevelopmentProps) {
  const { t } = useTranslation();

  return (
    <div className="text-(--brand-on-surface)">
      <section className="mx-auto w-full max-w-6xl px-6 pt-28 pb-12 sm:pt-32 sm:pb-16" data-reveal>
        <p className="text-sm font-semibold tracking-[0.22em] text-(--primary) uppercase">{sectionLabel}</p>
        <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
          {t("underDevelopment.title")}
        </h1>
        <p className="mt-6 max-w-4xl text-base leading-8 text-white/78 sm:text-lg">
          {t("underDevelopment.text")}
        </p>
      </section>

      <section
        className="border-y border-white/10 bg-[linear-gradient(140deg,rgba(11,15,25,0.92),rgba(15,21,40,0.96))]"
        data-reveal
      >
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-16 sm:py-20">
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {t("underDevelopment.ctaTitle")}
          </h2>
          <p className="max-w-3xl text-base leading-8 text-slate-200 sm:text-lg">
            {t("underDevelopment.ctaText")}
          </p>
          <ConversionCtaButton
            href={contactHref}
            ariaLabel={t("underDevelopment.ctaAriaLabel")}
            className="h-auto min-h-14 w-full max-w-full px-5 py-3 text-center leading-tight whitespace-normal sm:min-h-15 sm:w-auto sm:px-8 sm:py-0 sm:whitespace-nowrap"
          >
            {t("underDevelopment.ctaButton")}
          </ConversionCtaButton>
        </div>
      </section>
    </div>
  );
}
