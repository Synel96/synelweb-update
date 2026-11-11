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
    <article className="group bento-card fancy-card-lift tech-card-hover relative overflow-hidden rounded-3xl p-6 sm:p-7">
      <span className="tech-card-hover-shine" aria-hidden="true" />

      <div className="flex items-start justify-between gap-4">
        <div className="fancy-tile flex size-18 items-center justify-center rounded-2xl shadow-[0_18px_40px_-26px_var(--accent-glow)] transition-all duration-300 group-hover:scale-[1.04]">
          <TechnologyLogo
            name={logo}
            className="size-11 transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <span className="fancy-chip rounded-full px-3 py-1 text-[0.7rem] font-semibold tracking-[0.18em] text-(--accent) uppercase">
          {badge}
        </span>
      </div>

      <div className="mt-6">
        <p className="fancy-eyebrow text-sm font-semibold tracking-[0.16em] text-(--accent) uppercase">
          {name}
        </p>
        <h3 className="mt-3 text-2xl font-semibold tracking-tight text-white transition-colors duration-300 group-hover:text-(--brand-on-surface)">
          {title}
        </h3>
        <span className="fancy-title-bar" aria-hidden="true" />
        <p className="mt-4 text-sm leading-7 text-white/78 sm:text-base">{summary}</p>
      </div>

      <div className="fancy-panel mt-6 rounded-2xl p-5">
        <p className="text-xs font-semibold tracking-[0.18em] text-(--primary) uppercase">
          {valueLabel}
        </p>
        <p className="mt-3 text-sm leading-7 text-white/82 sm:text-base">{valueText}</p>
      </div>
    </article>
  );
}
