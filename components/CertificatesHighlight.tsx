import { ArrowRightIcon, BadgeCheckIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { localizePath } from "@/src/localizedRoutes";
import { strongestFirst } from "@/src/hooks/use-certificates";
import { formatCertificateDate, type Certificate } from "@/src/services/certificatesService";
import type { AppLang } from "@/src/services/serviceCardsService";

const SHOWN = 3;

// A short strip of the strongest certificates, linking to the full page.
export function CertificatesHighlight({
  certificates,
  lang,
}: {
  certificates: Certificate[];
  lang: AppLang;
}) {
  const { t } = useTranslation();
  if (certificates.length === 0) return null;
  const shown = strongestFirst(certificates).slice(0, SHOWN);

  return (
    <section className="mx-auto w-full max-w-6xl px-6 pb-16 sm:pb-20" data-reveal>
      <div className="mx-auto max-w-3xl text-center">
        <p className="fancy-eyebrow text-xs font-semibold tracking-[0.2em] text-(--accent) uppercase">
          {t("about.certificates.label")}
        </p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
          {t("about.certificates.title")}
        </h2>
        <p className="mt-3 text-base leading-7 text-pretty text-white/75">
          {t("about.certificates.text")}
        </p>
      </div>

      <ul className="mt-8 grid gap-4 md:grid-cols-3">
        {shown.map((certificate) => {
          const content = (
            <>
              <BadgeCheckIcon className="size-6 shrink-0 text-emerald-300" aria-hidden="true" />
              <span className="min-w-0">
                <span className="block leading-snug font-semibold text-white">
                  {certificate.title}
                </span>
                <span className="mt-1.5 block text-sm text-white/65">
                  {certificate.issuer} · {formatCertificateDate(certificate.issuedOn, lang)}
                </span>
                <span className="mt-2 inline-block rounded-full border border-white/12 bg-white/6 px-2.5 py-0.5 text-[0.68rem] font-semibold tracking-[0.08em] text-white/80 uppercase">
                  {t(`certificatesPage.kind.${certificate.kind}`)}
                </span>
              </span>
            </>
          );
          return (
            <li key={certificate.id}>
              {certificate.credentialUrl ? (
                <a
                  href={certificate.credentialUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="fancy-card fancy-card-lift flex h-full gap-4 rounded-2xl p-5"
                >
                  {content}
                </a>
              ) : (
                <div className="fancy-card flex h-full gap-4 rounded-2xl p-5">{content}</div>
              )}
            </li>
          );
        })}
      </ul>

      <div className="mt-8 text-center">
        <a
          href={localizePath("/certificates", lang)}
          className="inline-flex items-center gap-2 text-sm font-semibold tracking-[0.08em] text-(--accent) uppercase transition-colors hover:text-(--primary)"
        >
          {t("about.certificates.all", { count: certificates.length })}
          <ArrowRightIcon className="size-4" aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
