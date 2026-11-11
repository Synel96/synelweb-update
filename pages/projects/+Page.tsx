import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { usePageContext } from "vike-react/usePageContext";
import { ConversionCtaButton } from "@/components/ConversionCtaButton";
import { ProjectShowcaseCard } from "@/components/ProjectShowcaseCard";
import { DEFAULT_LANG, type SupportedLang } from "@/src/i18n-config";
import { localizePath } from "@/src/localizedRoutes";
import { quoteFormHref } from "@/src/quoteForm";
import { trackEvent } from "@/src/analytics";
import type { Project } from "@/src/services/projectServices";
import { isTechnologyLogoName, type TechnologyLogoName } from "@/components/TechnologyLogo";

type Data = {
  projects: Project[];
  fetchError: boolean;
};

export default function Page() {
  const { t } = useTranslation();
  const pageContext = usePageContext() as { data?: Data; lang?: SupportedLang };
  const { projects = [], fetchError = true } = pageContext.data ?? {};
  const lang = pageContext.lang ?? DEFAULT_LANG;

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
    <>
      <section className="mx-auto w-full max-w-6xl px-6 pt-36 pb-16 sm:pt-40 sm:pb-20">
        <header className="mx-auto mb-10 max-w-3xl text-center">
          <p className="text-xs font-semibold tracking-[0.18em] text-(--accent) uppercase">
            {t("homeFlow.projects.label")}
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {t("homeFlow.projects.title")}
          </h1>
          <p className="mt-4 text-left text-base leading-8 text-white/80 sm:text-lg">
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
                expandLabel={t("projectsPage.expandDescription")}
                collapseLabel={t("projectsPage.collapseDescription")}
                stackTitle={t("homeFlow.projects.stackLabel")}
                stack={project.stack
                  .filter((item): item is { name: string; logo: TechnologyLogoName } =>
                    isTechnologyLogoName(item.logo)
                  )
                  .map((item) => ({
                    name: item.name,
                    logo: item.logo,
                  }))}
                scoresTitle={t("homeFlow.projects.lighthouseTitle")}
                scoresExpandLabel={t("projectsPage.expandScores")}
                scoresCollapseLabel={t("projectsPage.collapseScores")}
                mobileScoresLabel={t("homeFlow.projects.scoreGroups.mobile")}
                desktopScoresLabel={t("homeFlow.projects.scoreGroups.desktop")}
                mobileScores={project.mobileScores.map((item) => ({
                  label: scoreLabelMap[item.label as keyof typeof scoreLabelMap] ?? item.label,
                  value: item.value,
                }))}
                desktopScores={project.desktopScores.map((item) => ({
                  label: scoreLabelMap[item.label as keyof typeof scoreLabelMap] ?? item.label,
                  value: item.value,
                }))}
                liveHref={project.liveUrl}
                liveLabel={t("homeFlow.projects.liveCta")}
              />
            ))}
          </div>
        )}

        <div
          className="fancy-card mx-auto mt-16 max-w-2xl rounded-3xl p-8 text-center sm:p-10"
          data-reveal
        >
          <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            {t("projectsPage.cta.title")}
          </h2>
          <p className="mt-3 text-base leading-7 text-white/78">{t("projectsPage.cta.text")}</p>
          <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <ConversionCtaButton
              href={quoteFormHref(lang)}
              onClick={() => trackEvent("quote_cta_click", { location: "projects" })}
              ariaLabel={t("projectsPage.cta.contactAriaLabel")}
            >
              {t("projectsPage.cta.contactLabel")}
            </ConversionCtaButton>
            <a
              href={localizePath("/services", lang)}
              className="text-sm font-semibold tracking-[0.08em] text-(--accent) uppercase transition-colors hover:text-(--primary)"
            >
              {t("projectsPage.cta.servicesLabel")}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
