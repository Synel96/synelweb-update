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
  headingLevel?: "h2" | "h3";
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
  headingLevel = "h3",
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
  const HeadingTag = headingLevel;

  return (
    <article className="rounded-[1.7rem] border border-white/10 bg-[linear-gradient(155deg,rgba(16,22,42,0.9),rgba(12,18,33,0.95))] p-4 shadow-[0_22px_54px_-32px_var(--accent-glow)] sm:p-6 lg:p-7">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-start lg:gap-6">
        <div className="lg:order-2">
          <ProjectPreviewCarousel
            previewImage={previewImage}
            otherImages={otherImages}
            title={title}
            prioritize={prioritizeImage}
          />
        </div>

        <div className="lg:order-1">
          <HeadingTag className="text-xl font-semibold tracking-tight text-white sm:text-2xl lg:text-[1.7rem]">
            {title}
          </HeadingTag>

          <p className="mt-4 text-sm leading-7 text-white/80 sm:text-[0.96rem]">{description}</p>

          <div className="mt-5">
            <p className="text-[0.68rem] font-semibold tracking-[0.16em] text-(--accent) uppercase">
              {stackTitle}
            </p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {stack.map((item) => (
                <li
                  key={item.name}
                  className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-2.5 py-1.5"
                >
                  <TechnologyLogo name={item.logo} className="size-3.5" />
                  <span className="text-[0.72rem] font-medium text-white/88">{item.name}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-5 rounded-2xl border border-white/10 bg-black/22 p-3.5 sm:p-4">
            <p className="text-[0.68rem] font-semibold tracking-[0.16em] text-(--accent) uppercase">
              {scoresTitle}
            </p>
            <div className="mt-3 grid gap-4 xl:grid-cols-2">
              <div>
                <p className="text-[0.68rem] font-semibold tracking-[0.14em] text-white/65 uppercase">
                  {mobileScoresLabel}
                </p>
                <div className="mt-2 grid grid-cols-2 gap-2.5 sm:grid-cols-4 xl:grid-cols-2">
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
                <div className="mt-2 grid grid-cols-2 gap-2.5 sm:grid-cols-4 xl:grid-cols-2">
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

          <div className="mt-5">
            <a
              href={liveHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-white/14 bg-white/8 px-4 py-2.5 text-sm font-semibold tracking-[0.08em] text-white uppercase transition-colors hover:bg-white/14"
            >
              <span>{liveLabel}</span>
              <ExternalLinkIcon className="size-4" />
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
