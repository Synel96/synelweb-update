import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { usePageContext } from "vike-react/usePageContext";
import { ProjectShowcaseCard } from "@/components/ProjectShowcaseCard";
import type { Project } from "@/src/services/projectServices";
import { isTechnologyLogoName } from "@/components/TechnologyLogo";

type Data = {
  projects: Project[];
  fetchError: boolean;
};

export default function Page() {
  const { t } = useTranslation();
  const pageContext = usePageContext() as { data?: Data };
  const { projects = [], fetchError = true } = pageContext.data ?? {};

  const scoreLabelMap = useMemo(
    () => ({
      performance: t("homeFlow.projects.scoreLabels.performance"),
      accessibility: t("homeFlow.projects.scoreLabels.accessibility"),
      bestPractices: t("homeFlow.projects.scoreLabels.bestPractices"),
      seo: t("homeFlow.projects.scoreLabels.seo"),
    }),
    [t]
  );

  return (
    <section className="mx-auto w-full max-w-6xl px-6 pt-36 pb-16 sm:pt-40 sm:pb-20">
      <header className="mb-10" data-reveal>
        <p className="text-xs font-semibold tracking-[0.18em] text-(--accent) uppercase">
          {t("homeFlow.projects.label")}
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          {t("homeFlow.projects.title")}
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-white/80 sm:text-lg">
          {t("homeFlow.projects.text")}
        </p>
      </header>

      {fetchError || projects.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-white/15 bg-white/3 p-8 text-center">
          <p className="text-base text-white/86">
            {fetchError ? t("projectsPage.fetchError") : t("projectsPage.emptyState")}
          </p>
        </div>
      ) : (
        <div className="space-y-6" data-reveal>
          {projects.map((project, projectIndex) => (
            <ProjectShowcaseCard
              key={project.id}
              title={project.name}
              headingLevel="h2"
              previewImage={project.previewImage}
              otherImages={project.otherImages}
              prioritizeImage={projectIndex === 0}
              description={project.description}
              stackTitle={t("homeFlow.projects.stackLabel")}
              stack={project.stack
                .filter((item) => isTechnologyLogoName(item.logo))
                .map((item) => ({
                  name: item.name,
                  logo: item.logo,
                }))}
              scoresTitle={t("homeFlow.projects.lighthouseTitle")}
              mobileScoresLabel={t("homeFlow.projects.scoreGroups.mobile")}
              desktopScoresLabel={t("homeFlow.projects.scoreGroups.desktop")}
              mobileScores={project.mobileScores.map((item) => ({
                label:
                  scoreLabelMap[item.label as keyof typeof scoreLabelMap] ?? item.label,
                value: item.value,
              }))}
              desktopScores={project.desktopScores.map((item) => ({
                label:
                  scoreLabelMap[item.label as keyof typeof scoreLabelMap] ?? item.label,
                value: item.value,
              }))}
              liveHref={project.liveUrl}
              liveLabel={t("homeFlow.projects.liveCta")}
            />
          ))}
        </div>
      )}
    </section>
  );
}
