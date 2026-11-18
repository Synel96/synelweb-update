import { AlertTriangleIcon, CheckCircle2Icon, InfoIcon, XCircleIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { describeAuditItem, sortAuditItems, type AuditGroup } from "@/src/siteCheckAudit";
import type { AuditItem, AuditStatus } from "@/src/services/siteCheckService";
import type { AppLang } from "@/src/services/serviceCardsService";

const STATUS_STYLE: Record<AuditStatus, { Icon: typeof InfoIcon; className: string }> = {
  pass: { Icon: CheckCircle2Icon, className: "text-emerald-300" },
  warn: { Icon: AlertTriangleIcon, className: "text-amber-300" },
  fail: { Icon: XCircleIcon, className: "text-red-300" },
  info: { Icon: InfoIcon, className: "text-sky-300" },
};

// One block of the result (SEO basics or technical details): every item
// with a status icon and a one-line explanation, problems first.
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
  const rows = sortAuditItems(items)
    .map((item) => ({ item, text: describeAuditItem(group, item, t, lang) }))
    .filter((row): row is { item: AuditItem; text: { label: string; message: string } } =>
      Boolean(row.text)
    );

  return (
    <section className="mt-8 border-t border-white/10 pt-6">
      <h3 className="text-lg font-semibold text-white">
        {t(group === "seo" ? "siteCheck.audit.seoTitle" : "siteCheck.audit.techTitle")}
      </h3>
      <p className="mt-1 text-sm text-white/65">
        {t(group === "seo" ? "siteCheck.audit.seoText" : "siteCheck.audit.techText")}
      </p>
      {note ? (
        <p className="mt-3 rounded-xl border border-sky-300/30 bg-sky-400/10 px-4 py-3 text-sm text-sky-100">
          {note}
        </p>
      ) : null}
      {rows.length > 0 ? (
        <ul className="mt-4 grid gap-2 md:grid-cols-2">
          {rows.map(({ item, text }) => {
            const { Icon, className } = STATUS_STYLE[item.status];
            return (
              <li
                key={item.id}
                className="flex gap-3 rounded-xl border border-white/10 bg-white/4 px-4 py-3 text-sm"
              >
                <Icon className={`mt-0.5 size-4 shrink-0 ${className}`} aria-hidden="true" />
                <div>
                  <p className="font-medium text-white">
                    {text.label}
                    <span className={`ml-2 text-xs font-semibold ${className}`}>
                      {t(`siteCheck.audit.status.${item.status}`)}
                    </span>
                  </p>
                  <p className="mt-0.5 leading-6 text-white/72">{text.message}</p>
                </div>
              </li>
            );
          })}
        </ul>
      ) : null}
    </section>
  );
}
