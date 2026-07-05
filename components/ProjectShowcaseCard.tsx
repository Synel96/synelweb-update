import { ExternalLinkIcon } from "lucide-react";
import { TechnologyLogo, type TechnologyLogoName } from "@/components/TechnologyLogo";
import { LighthouseScoreRing } from "@/components/LighthouseScoreRing";
import { ProjectPreviewCarousel } from "@/components/ProjectPreviewCarousel";

type ScoreItem = {
  label: string;
  value: number;
};

type ProjectShowcaseCardProps = {
  title: string;
  previewImage: string;
  otherImages: string[];
  prioritizeImage?: boolean;
  description: string;
  stackTitle: string;
  stack: Array<{ name: string; logo: TechnologyLogoName }>;
  scoresTitle: string;
  mobileScoresLabel: string;
  desktopScoresLabel: string;
  mobileScores: ScoreItem[];
  desktopScores: ScoreItem[];
  liveHref: string;
  liveLabel: string;
};

export function ProjectShowcaseCard({
  title,
  previewImage,
  otherImages,
  prioritizeImage = false,
  description,
  stackTitle,
  stack,
  scoresTitle,
  mobileScoresLabel,
  desktopScoresLabel,
  mobileScores,
  desktopScores,
  liveHref,
  liveLabel,
}: ProjectShowcaseCardProps) {
  return (
    <article className="rounded-3xl border border-white/10 bg-[linear-gradient(155deg,rgba(16,22,42,0.9),rgba(12,18,33,0.95))] p-6 shadow-[0_22px_54px_-32px_var(--accent-glow)] sm:p-8">
      <h3 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">{title}</h3>

      <div className="mt-5">
        <p className="text-xs font-semibold tracking-[0.16em] text-(--accent) uppercase">
          {stackTitle}
        </p>
        <ul className="mt-3 flex flex-wrap gap-2.5">
          {stack.map((item) => (
            <li
              key={item.name}
              className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-3 py-1.5"
            >
              <TechnologyLogo name={item.logo} className="size-4" />
              <span className="text-xs font-medium text-white/88">{item.name}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6">
        <ProjectPreviewCarousel
          previewImage={previewImage}
          otherImages={otherImages}
          title={title}
          prioritize={prioritizeImage}
        />
      </div>

      <p className="mt-6 text-sm leading-7 text-white/80 sm:text-base">{description}</p>

      <div className="mt-6 rounded-2xl border border-white/10 bg-black/22 p-4 sm:p-5">
        <p className="text-xs font-semibold tracking-[0.16em] text-(--accent) uppercase">
          {scoresTitle}
        </p>
        <div className="mt-4 space-y-5">
          <div>
            <p className="text-[0.68rem] font-semibold tracking-[0.14em] text-white/65 uppercase">
              {mobileScoresLabel}
            </p>
            <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {mobileScores.map((item) => (
                <LighthouseScoreRing
                  key={`mobile-${item.label}`}
                  label={item.label}
                  score={item.value}
                />
              ))}
            </div>
          </div>

          <div>
            <p className="text-[0.68rem] font-semibold tracking-[0.14em] text-white/65 uppercase">
              {desktopScoresLabel}
            </p>
            <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {desktopScores.map((item) => (
                <LighthouseScoreRing
                  key={`desktop-${item.label}`}
                  label={item.label}
                  score={item.value}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <a
          href={liveHref}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-xl border border-white/14 bg-white/8 px-4 py-3 text-sm font-semibold tracking-[0.08em] text-white uppercase transition-colors hover:bg-white/14"
        >
          <span>{liveLabel}</span>
          <ExternalLinkIcon className="size-4" />
        </a>
      </div>
    </article>
  );
}
