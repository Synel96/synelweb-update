import { useId, useState } from "react";
import {
  AlertTriangleIcon,
  CheckCircle2Icon,
  ChevronDownIcon,
  CircleHelpIcon,
  CpuIcon,
  FileSearchIcon,
  InfoIcon,
  LayersIcon,
  MonitorIcon,
  ShieldCheckIcon,
  SmartphoneIcon,
  XCircleIcon,
  type LucideIcon,
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

// Each status has its colour: the icon, a tinted badge, a faint card tint
// and a stripe on the card's left edge.
const STATUS_STYLE: Record<
  AuditStatus,
  { Icon: LucideIcon; className: string; badge: string; card: string; stripe: string }
> = {
  pass: {
    Icon: CheckCircle2Icon,
    className: "text-emerald-300",
    badge: "border-emerald-300/35 bg-emerald-400/10 text-emerald-200",
    card: "border-emerald-300/12 bg-emerald-400/[0.035]",
    stripe: "bg-emerald-400/70",
  },
  warn: {
    Icon: AlertTriangleIcon,
    className: "text-amber-300",
    badge: "border-amber-300/35 bg-amber-400/10 text-amber-200",
    card: "border-amber-300/15 bg-amber-400/[0.045]",
    stripe: "bg-amber-400/80",
  },
  fail: {
    Icon: XCircleIcon,
    className: "text-rose-300",
    badge: "border-rose-300/40 bg-rose-500/12 text-rose-200",
    card: "border-rose-300/18 bg-rose-500/[0.06]",
    stripe: "bg-rose-400/85",
  },
  info: {
    Icon: InfoIcon,
    className: "text-sky-300",
    badge: "border-sky-300/30 bg-sky-400/10 text-sky-200",
    card: "border-white/10 bg-white/[0.035]",
    stripe: "bg-sky-400/60",
  },
};

const GROUP_ICON: Record<AuditGroup, LucideIcon> = {
  seo: FileSearchIcon,
  privacy: ShieldCheckIcon,
  tech: CpuIcon,
};

// The rounded icon tile at the start of each result block.
export function SectionIcon({ Icon }: { Icon: LucideIcon }) {
  return (
    <span className="fancy-tile flex size-10 shrink-0 items-center justify-center rounded-xl">
      <Icon className="size-5 text-(--accent)" aria-hidden="true" />
    </span>
  );
}

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
  const { Icon, className, badge, card, stripe } = STATUS_STYLE[item.status];

  return (
    <li
      className={`relative flex gap-3 overflow-hidden rounded-xl border py-3 pr-4 pl-5 text-sm transition-colors hover:border-white/20 ${card}`}
    >
      <span className={`absolute inset-y-0 left-0 w-1 ${stripe}`} aria-hidden="true" />
      <Icon className={`mt-0.5 size-[1.05rem] shrink-0 ${className}`} aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <p className="flex items-start justify-between gap-2 font-semibold text-white">
          <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
            {label}
            <span
              className={`rounded-full border px-2 py-px text-[0.68rem] font-semibold tracking-wide ${badge}`}
            >
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
      className="group/audit mt-6 rounded-2xl border border-white/10 bg-white/3 transition-colors open:bg-white/[0.045]"
      open={hasProblems}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-4 sm:px-5 [&::-webkit-details-marker]:hidden">
        <span className="flex min-w-0 items-center gap-3">
          <SectionIcon Icon={GROUP_ICON[group]} />
          <span className="min-w-0">
            <span className="block text-lg font-semibold text-white">
              {t(`siteCheck.audit.${group}Title`)}
            </span>
            <span className="sr-only">
              {hasProblems
                ? t("siteCheck.audit.summary", counts)
                : t("siteCheck.audit.allGood", counts)}
            </span>
            {/* The same counts as coloured chips; the line above is for
                screen readers. */}
            <span className="mt-1.5 flex flex-wrap gap-1.5" aria-hidden="true">
              {(["fail", "warn", "pass"] as const)
                .filter((status) => counts[status] > 0)
                .map((status) => (
                  <span
                    key={status}
                    className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold ${STATUS_STYLE[status].badge}`}
                  >
                    <span className="tabular-nums">{counts[status]}</span>
                    {t(`siteCheck.audit.status.${status}`).toLowerCase()}
                  </span>
                ))}
            </span>
          </span>
        </span>
        <ChevronDownIcon
          className="size-5 shrink-0 text-(--accent) transition-transform group-open/audit:rotate-180"
          aria-hidden="true"
        />
      </summary>

      <div className="px-4 pb-5 sm:px-5">
        <p className="border-t border-white/8 pt-4 text-sm text-white/65">
          {t(`siteCheck.audit.${group}Text`)}
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
                className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-emerald-300/30 bg-emerald-400/8 px-3 py-1.5 text-sm font-semibold text-emerald-200 transition-colors hover:border-emerald-300/50 hover:bg-emerald-400/15"
              >
                {showPassed
                  ? t("siteCheck.audit.hidePassed")
                  : t("siteCheck.audit.showPassed", { count: passed.length })}
              </button>
            ) : null}
          </>
        ) : null}
        {group === "privacy" ? (
          <p className="mt-4 text-xs text-white/45">{t("siteCheck.audit.privacyDisclaimer")}</p>
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
      <SectionIcon Icon={LayersIcon} />
      <div className="min-w-0">
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

// Snapshots of the loading as the measured device saw them: the last one
// large, the filmstrip under it with the time each frame was taken.
export function SiteCheckScreens({
  screenshots,
  strategy,
  lang,
}: {
  screenshots: { final: string | null; filmstrip: Array<{ timing: number; data: string }> };
  strategy: "mobile" | "desktop";
  lang: AppLang;
}) {
  const { t } = useTranslation();
  if (!screenshots.final && screenshots.filmstrip.length === 0) return null;
  const seconds = (ms: number) =>
    (ms / 1000).toLocaleString(lang === "en" ? "en-US" : lang === "de" ? "de-DE" : "hu-HU", {
      maximumFractionDigits: 1,
    });

  return (
    <section className="mt-8 rounded-2xl border border-white/10 bg-white/3 px-4 py-5 sm:px-5">
      <div className="flex items-center gap-3">
        <SectionIcon Icon={strategy === "mobile" ? SmartphoneIcon : MonitorIcon} />
        <div>
          <h3 className="text-lg font-semibold text-white">
            {t(`siteCheck.audit.shotsTitle.${strategy}`)}
          </h3>
          <p className="mt-0.5 text-sm text-white/65">{t("siteCheck.audit.shotsText")}</p>
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-5 md:flex-row md:items-start">
        {screenshots.final ? (
          <img
            src={screenshots.final}
            alt={t(`siteCheck.audit.shotsTitle.${strategy}`)}
            className={`mx-auto shrink-0 rounded-xl border border-white/15 bg-white shadow-lg md:mx-0 ${
              strategy === "mobile" ? "w-44" : "w-full max-w-sm"
            }`}
            loading="lazy"
            decoding="async"
          />
        ) : null}
        {screenshots.filmstrip.length > 0 ? (
          <ol className="flex min-w-0 gap-3 overflow-x-auto pb-2">
            {screenshots.filmstrip.map((frame) => (
              <li key={frame.timing} className="shrink-0 text-center">
                <img
                  src={frame.data}
                  alt=""
                  className={`rounded-md border border-white/10 bg-white ${
                    strategy === "mobile" ? "h-28" : "h-20"
                  } w-auto`}
                  loading="lazy"
                  decoding="async"
                />
                <span className="mt-1 block text-xs font-semibold text-white/60">
                  {t("siteCheck.audit.frameAt", { seconds: seconds(frame.timing) })}
                </span>
              </li>
            ))}
          </ol>
        ) : null}
      </div>
    </section>
  );
}
