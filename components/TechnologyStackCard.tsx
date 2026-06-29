import type { TechnologyLogoName } from "@/components/TechnologyLogo";
import { TechnologyLogo } from "@/components/TechnologyLogo";

type TechnologyStackCardProps = {
  logo: TechnologyLogoName;
  name: string;
  title: string;
  summary: string;
  valueLabel: string;
  valueText: string;
  badge: string;
};

export function TechnologyStackCard({
  logo,
  name,
  title,
  summary,
  valueLabel,
  valueText,
  badge,
}: TechnologyStackCardProps) {
  return (
    <article className="bento-card rounded-3xl p-6 sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <div className="flex size-18 items-center justify-center rounded-2xl border border-white/10 bg-white/6 shadow-[0_18px_40px_-26px_var(--accent-glow)]">
          <TechnologyLogo name={logo} className="size-11" />
        </div>
        <span className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-[0.7rem] font-semibold tracking-[0.18em] text-(--accent) uppercase">
          {badge}
        </span>
      </div>

      <div className="mt-6">
        <p className="text-sm font-semibold tracking-[0.16em] text-(--accent) uppercase">{name}</p>
        <h3 className="mt-3 text-2xl font-semibold tracking-tight text-white">{title}</h3>
        <p className="mt-4 text-sm leading-7 text-white/78 sm:text-base">{summary}</p>
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-black/18 p-5">
        <p className="text-xs font-semibold tracking-[0.18em] text-(--primary) uppercase">
          {valueLabel}
        </p>
        <p className="mt-3 text-sm leading-7 text-white/82 sm:text-base">{valueText}</p>
      </div>
    </article>
  );
}
