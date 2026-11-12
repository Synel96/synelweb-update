import { BadgeCheckIcon, CalendarIcon, ExternalLinkIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { formatCertificateDate, type Certificate } from "@/src/services/certificatesService";
import type { AppLang } from "@/src/services/serviceCardsService";

// "Python Institute (OpenEDG)" -> "PI", "Udemy · …" -> "UD", "Google Skillshop" -> "GS".
export function issuerInitials(issuer: string): string {
  const name = issuer
    .split("·")[0]
    .replace(/\(.*?\)/g, "")
    .trim();
  const words = name.split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

type CertificateCardProps = {
  certificate: Certificate;
  lang: AppLang;
};

export function CertificateCard({ certificate, lang }: CertificateCardProps) {
  const { t } = useTranslation();
  const { title, issuer, kind, hours, issuedOn, expiresOn, isExpired, skills } = certificate;
  const issued = formatCertificateDate(issuedOn, lang);
  // Hungarian "2027. november 8." + "-ig" must read "2027. november 8-ig".
  const expiresRaw = expiresOn ? formatCertificateDate(expiresOn, lang) : "";
  const expires = lang === "hu" ? expiresRaw.replace(/\.$/, "") : expiresRaw;
  const kindLabel =
    kind === "course"
      ? hours
        ? `${t("certificatesPage.kind.course")} · ${t("certificatesPage.hours", {
            hours: hours.toLocaleString(
              lang === "en" ? "en-US" : lang === "de" ? "de-DE" : "hu-HU"
            ),
          })}`
        : t("certificatesPage.kind.course")
      : t("certificatesPage.kind.exam");

  return (
    <article className="fancy-card flex h-full flex-col rounded-3xl p-6">
      <div className="flex items-center justify-between gap-3">
        <span className="fancy-tile flex size-13 shrink-0 items-center justify-center overflow-hidden rounded-xl">
          {certificate.badgeImage ? (
            <img
              src={certificate.badgeImage}
              alt=""
              className="size-full object-contain p-1.5"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <span className="text-base font-bold text-white" aria-hidden="true">
              {issuerInitials(issuer)}
            </span>
          )}
        </span>
        {certificate.credentialUrl ? (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300/40 bg-emerald-400/12 px-2.5 py-1 text-[0.68rem] font-semibold tracking-[0.08em] text-emerald-300 uppercase">
            <BadgeCheckIcon className="size-3.5" aria-hidden="true" />
            {t("certificatesPage.verified")}
          </span>
        ) : null}
      </div>

      <h3 className="mt-5 text-xl leading-snug font-semibold tracking-tight text-white">{title}</h3>
      <span className="fancy-title-bar" aria-hidden="true" />

      <p className="mt-3 text-sm text-white/65">
        {issuer}
        {issued ? ` · ${issued}` : ""}
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
        <span className="rounded-full border border-white/12 bg-white/6 px-2.5 py-0.5 text-[0.68rem] font-semibold tracking-[0.08em] text-white/80 uppercase">
          {kindLabel}
        </span>
        {isExpired ? (
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-rose-300/90">
            <CalendarIcon className="size-3.5" aria-hidden="true" />
            {t("certificatesPage.expired")}
          </span>
        ) : expires ? (
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-(--color-secondary-warm)">
            <CalendarIcon className="size-3.5" aria-hidden="true" />
            {t("certificatesPage.validUntil", { date: expires })}
          </span>
        ) : null}
      </div>

      {skills.length > 0 ? (
        <ul className="mt-4 flex flex-wrap gap-1.5" aria-label={title}>
          {skills.map((skill) => (
            <li
              key={skill}
              className="fancy-chip rounded-full px-2.5 py-1 text-xs font-medium text-white/88"
            >
              {skill}
            </li>
          ))}
        </ul>
      ) : null}

      {certificate.credentialUrl ? (
        <div className="mt-auto pt-5">
          <div className="fancy-divider mb-4" aria-hidden="true" />
          <a
            href={certificate.credentialUrl}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-2 text-[0.8rem] font-semibold tracking-[0.04em] text-(--accent) uppercase transition-colors hover:text-(--primary) sm:text-sm sm:tracking-[0.08em]"
          >
            {t("certificatesPage.view")}
            <ExternalLinkIcon
              className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden="true"
            />
            <span className="sr-only">: {title}</span>
          </a>
        </div>
      ) : null}
    </article>
  );
}
