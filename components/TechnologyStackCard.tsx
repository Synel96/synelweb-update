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
    <article className="group bento-card tech-card-hover relative overflow-hidden rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/18 hover:shadow-[0_0_0_1px_color-mix(in_oklab,var(--accent),transparent_58%)_inset,0_0_0_1px_color-mix(in_oklab,var(--color-secondary-warm),transparent_82%),0_18px_38px_-28px_color-mix(in_oklab,var(--color-secondary-hot),transparent_42%),0_26px_58px_-32px_var(--accent-glow)] sm:p-7">
      <span className="tech-card-hover-shine" aria-hidden="true" />

      <div className="flex items-start justify-between gap-4">
        <div className="flex size-18 items-center justify-center rounded-2xl border border-white/10 bg-white/6 shadow-[0_18px_40px_-26px_var(--accent-glow)] transition-all duration-300 group-hover:scale-[1.04] group-hover:border-white/20 group-hover:bg-white/9">
          <TechnologyLogo
            name={logo}
            className="size-11 transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <span className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-[0.7rem] font-semibold tracking-[0.18em] text-(--accent) uppercase transition-colors duration-300 group-hover:border-white/16 group-hover:bg-white/8">
          {badge}
        </span>
      </div>

      <div className="mt-6">
        <p className="text-sm font-semibold tracking-[0.16em] text-(--accent) uppercase">{name}</p>
        <h3 className="mt-3 text-2xl font-semibold tracking-tight text-white transition-colors duration-300 group-hover:text-(--brand-on-surface)">
          {title}
        </h3>
        <p className="mt-4 text-sm leading-7 text-white/78 sm:text-base">{summary}</p>
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-black/18 p-5 transition-all duration-300 group-hover:border-white/14 group-hover:bg-black/24">
        <p className="text-xs font-semibold tracking-[0.18em] text-(--primary) uppercase">
          {valueLabel}
        </p>
        <p className="mt-3 text-sm leading-7 text-white/82 sm:text-base">{valueText}</p>
      </div>
    </article>
  );
}
