import { CheckIcon, InfoIcon, XIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

function asList(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

// What the Google Search ads service covers and what it doesn't promise,
// shown under the marketing services.
export function AdsTerms() {
  const { t } = useTranslation();
  const doItems = asList(t("servicesPage.adsTerms.doItems", { returnObjects: true }));
  const notes = asList(t("servicesPage.adsTerms.notes", { returnObjects: true }));

  return (
    <div className="fancy-card mx-auto mt-8 max-w-4xl rounded-3xl p-6 sm:p-8" data-reveal>
      <p className="text-center text-xs font-semibold tracking-[0.18em] text-(--color-secondary-warm) uppercase">
        {t("servicesPage.adsTerms.label")}
      </p>
      <h3 className="mt-2 text-center text-xl font-semibold tracking-tight text-white sm:text-2xl">
        {t("servicesPage.adsTerms.title")}
      </h3>

      <div className="mt-6 grid gap-6 md:grid-cols-[1.4fr_1fr]">
        <div>
          <h4 className="text-sm font-semibold tracking-[0.12em] text-emerald-300 uppercase">
            {t("servicesPage.adsTerms.doTitle")}
          </h4>
          <ul className="mt-3 space-y-3">
            {doItems.map((item) => (
              <li key={item} className="flex gap-2.5 text-sm leading-6 text-white/82 sm:text-base">
                <CheckIcon className="mt-1 size-4 shrink-0 text-emerald-300" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/4 p-4 sm:p-5">
          <h4 className="flex items-center gap-2 text-sm font-semibold tracking-[0.12em] text-rose-300 uppercase">
            <XIcon className="size-4" aria-hidden="true" />
            {t("servicesPage.adsTerms.dontTitle")}
          </h4>
          <p className="mt-3 text-sm leading-6 text-white/78 sm:text-base">
            {t("servicesPage.adsTerms.dontText")}
          </p>
        </div>
      </div>

      {notes.length > 0 ? (
        <ul className="mt-6 space-y-2 border-t border-white/10 pt-5">
          {notes.map((note) => (
            <li key={note} className="flex gap-2.5 text-sm leading-6 text-white/70">
              <InfoIcon className="mt-0.5 size-4 shrink-0 text-(--accent)" aria-hidden="true" />
              <span>{note}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
