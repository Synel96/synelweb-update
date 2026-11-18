import { useId, useState } from "react";
import {
  AlertTriangleIcon,
  CheckCircle2Icon,
  ChevronDownIcon,
  CircleHelpIcon,
  InfoIcon,
  LayersIcon,
  XCircleIcon,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  auditItemHelp,
  countByStatus,
  describeAuditItem,
  describePlatform,
  sortAuditItems,
  type AuditGroup,
} from "@/src/siteCheckAudit";
import type { AuditItem, AuditStatus, SitePlatform } from "@/src/services/siteCheckService";
import type { AppLang } from "@/src/services/serviceCardsService";

const STATUS_STYLE: Record<AuditStatus, { Icon: typeof InfoIcon; className: string }> = {
  pass: { Icon: CheckCircle2Icon, className: "text-emerald-300" },
  warn: { Icon: AlertTriangleIcon, className: "text-amber-300" },
  fail: { Icon: XCircleIcon, className: "text-red-300" },
  info: { Icon: InfoIcon, className: "text-sky-300" },
};

function AuditRow({
  group,
  item,
  label,
  message,
}: {
  group: AuditGroup;
  item: AuditItem;
  label: string;
  message: string;
}) {
  const { t } = useTranslation();
  const [showHelp, setShowHelp] = useState(false);
  const helpId = useId();
  const help = auditItemHelp(group, item, t);
  const { Icon, className } = STATUS_STYLE[item.status];

  return (
    <li className="flex gap-3 rounded-xl border border-white/10 bg-white/4 px-4 py-3 text-sm">
      <Icon className={`mt-0.5 size-4 shrink-0 ${className}`} aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <p className="flex items-start justify-between gap-2 font-medium text-white">
          <span>
            {label}
            <span className={`ml-2 text-xs font-semibold ${className}`}>
              {t(`siteCheck.audit.status.${item.status}`)}
            </span>
          </span>
          {help ? (
            <button
              type="button"
              onClick={() => setShowHelp((open) => !open)}
              aria-expanded={showHelp}
              aria-controls={helpId}
              aria-label={`${label}: ${t("siteCheck.audit.helpLabel")}`}
              title={t("siteCheck.audit.helpLabel")}
              className="-m-1 shrink-0 rounded-full p-1 text-white/45 transition-colors hover:text-white focus-visible:text-white"
            >
              <CircleHelpIcon className="size-4" aria-hidden="true" />
            </button>
          ) : null}
        </p>
        <p className="mt-0.5 leading-6 text-white/72">{message}</p>
        {help && showHelp ? (
          <p id={helpId} className="mt-2 rounded-lg bg-white/6 px-3 py-2 leading-6 text-white/80">
            {help}
          </p>
        ) : null}
      </div>
    </li>
  );
}

// One category of the result (SEO basics or technical details). It opens by
// itself when something needs attention; the passed checks stay folded away
// behind a "+N OK" button so the problems stand out.
export function SiteCheckAudit({
  group,
  items,
  lang,
  note,
}: {
  group: AuditGroup;
  items: AuditItem[];
  lang: AppLang;
  note?: string;
}) {
  const { t } = useTranslation();
  const [showPassed, setShowPassed] = useState(false);
  const rows = sortAuditItems(items)
    .map((item) => ({ item, text: describeAuditItem(group, item, t, lang) }))
    .filter((row): row is { item: AuditItem; text: { label: string; message: string } } =>
      Boolean(row.text)
    );
  const counts = countByStatus(rows.map(({ item }) => item));
  const hasProblems = counts.fail + counts.warn > 0;
  const shown = rows.filter(({ item }) => item.status !== "pass");
  const passed = rows.filter(({ item }) => item.status === "pass");

  return (
    <details
      className="group/audit mt-6 rounded-2xl border border-white/10 bg-white/3"
      open={hasProblems}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-4 sm:px-5 [&::-webkit-details-marker]:hidden">
        <span>
          <span className="block text-lg font-semibold text-white">
            {t(group === "seo" ? "siteCheck.audit.seoTitle" : "siteCheck.audit.techTitle")}
          </span>
          <span className="mt-0.5 block text-xs font-semibold text-white/60">
            {hasProblems
              ? t("siteCheck.audit.summary", counts)
              : t("siteCheck.audit.allGood", counts)}
          </span>
        </span>
        <ChevronDownIcon
          className="size-5 shrink-0 text-(--accent) transition-transform group-open/audit:rotate-180"
          aria-hidden="true"
        />
      </summary>

      <div className="px-4 pb-5 sm:px-5">
        <p className="text-sm text-white/65">
          {t(group === "seo" ? "siteCheck.audit.seoText" : "siteCheck.audit.techText")}
        </p>
        {note ? (
          <p className="mt-3 rounded-xl border border-sky-300/30 bg-sky-400/10 px-4 py-3 text-sm text-sky-100">
            {note}
          </p>
        ) : null}
        {shown.length > 0 ? (
          <ul className="mt-4 grid gap-2 md:grid-cols-2">
            {shown.map(({ item, text }) => (
              <AuditRow key={item.id} group={group} item={item} {...text} />
            ))}
          </ul>
        ) : null}
        {passed.length > 0 ? (
          <>
            {showPassed || shown.length === 0 ? (
              <ul className="mt-2 grid gap-2 md:grid-cols-2">
                {passed.map(({ item, text }) => (
                  <AuditRow key={item.id} group={group} item={item} {...text} />
                ))}
              </ul>
            ) : null}
            {shown.length > 0 ? (
              <button
                type="button"
                onClick={() => setShowPassed((open) => !open)}
                aria-expanded={showPassed}
                className="mt-3 text-sm font-semibold text-emerald-300 transition-colors hover:text-emerald-200"
              >
                {showPassed
                  ? t("siteCheck.audit.hidePassed")
                  : t("siteCheck.audit.showPassed", { count: passed.length })}
              </button>
            ) : null}
          </>
        ) : null}
      </div>
    </details>
  );
}

// "What is the site built with?": a probable guess from the source code.
export function SiteCheckPlatform({ platform }: { platform: SitePlatform }) {
  const { t } = useTranslation();
  const { headline, note } = describePlatform(platform, t);

  return (
    <section className="mt-8 flex gap-3 rounded-2xl border border-white/10 bg-white/3 px-4 py-4 sm:px-5">
      <LayersIcon className="mt-0.5 size-5 shrink-0 text-(--accent)" aria-hidden="true" />
      <div>
        <h3 className="text-base font-semibold text-white">
          {t("siteCheck.audit.platform.title")}
        </h3>
        <p className="mt-1 text-sm font-medium text-white/90">{headline}</p>
        {note ? <p className="mt-1 text-sm text-white/65">{note}</p> : null}
        <p className="mt-2 text-xs text-white/45">{t("siteCheck.audit.platform.disclaimer")}</p>
      </div>
    </section>
  );
}
