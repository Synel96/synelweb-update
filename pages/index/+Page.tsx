import { useEffect, useRef, useState } from "react";
import {
  BriefcaseIcon,
  Code2Icon,
  ExternalLinkIcon,
  GaugeIcon,
  HandshakeIcon,
  MapPinIcon,
  RocketIcon,
  SearchIcon,
  ShieldCheckIcon,
  ShoppingCartIcon,
  SparklesIcon,
} from "lucide-react";
import { Trans, useTranslation } from "react-i18next";
import { usePageContext } from "vike-react/usePageContext";
import { ConversionCtaButton } from "@/components/ConversionCtaButton";
import { ProjectsPreviewCarousel } from "@/components/ProjectsPreviewCarousel";
import { ReviewsCarousel } from "@/components/ReviewsCarousel";
import { TechnologyLogo } from "@/components/TechnologyLogo";
import { cloudinaryVideoUrl } from "@/src/cloudinary";
import { DEFAULT_LANG, type SupportedLang } from "@/src/i18n-config";
import { localizePath } from "@/src/localizedRoutes";
import { getProjects, type Project } from "@/src/services/projectServices";
import type { AppLang } from "@/src/services/serviceCardsService";

type Data = {
  projects: Project[];
  fetchError: boolean;
};

const TECHNOLOGY_TEASER_LOGOS = ["react", "typescript", "tailwind", "django"] as const;

// Keeps the homepage teaser light: the full project list (with every
// preview image) lives on the dedicated /projects page.
const HOMEPAGE_PROJECTS_LIMIT = 6;

const SERVICE_BADGES = [
  { key: "landing", Icon: RocketIcon },
  { key: "business", Icon: BriefcaseIcon },
  { key: "webshop", Icon: ShoppingCartIcon },
  { key: "seo", Icon: SearchIcon },
] as const;

const PROJECT_BADGES = [
  { key: "lighthouse", Icon: GaugeIcon },
  { key: "customCode", Icon: Code2Icon },
  { key: "liveReferences", Icon: ExternalLinkIcon },
] as const;

const ABOUT_BADGES = [
  { key: "location", Icon: MapPinIcon },
  { key: "solo", Icon: HandshakeIcon },
  { key: "enterpriseStack", Icon: ShieldCheckIcon },
] as const;

const HERO_VIDEO_UPLOAD_PATH = "f_auto,q_auto/v1782411197/hero_wujueq.webm";
const HERO_VIDEO_URL = cloudinaryVideoUrl(HERO_VIDEO_UPLOAD_PATH);
const HERO_VIDEO_POSTER_URL =
  "https://res.cloudinary.com/dmwulp3dl/image/upload/f_auto,q_auto:low,w_960,c_limit,dpr_auto/v1784120435/coverr-temp-sftfwatermarkedvideo00436be495bc341e4b7274f83a560daa2mp4-5896-1080p_1__exported_0_dkidt5.webp";

export default function Page() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { t } = useTranslation();
  const pageContext = usePageContext() as { lang?: SupportedLang; data?: Data };
  const lang = pageContext.lang ?? DEFAULT_LANG;
  const [projects, setProjects] = useState<Project[]>(
    (pageContext.data?.projects ?? []).slice(0, HOMEPAGE_PROJECTS_LIMIT)
  );

  const langHref = (href: string) =>
    href.startsWith("/#") ? `/${lang}/${href.slice(1)}` : localizePath(href, lang);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.playbackRate = 0.75;
  }, []);

  // The build-time prerender (pages/index/+data.ts) bakes projects into the
  // static HTML for fast first paint and SEO, but that fetch can fail or go
  // stale (e.g. the backend was cold-starting during the build). Re-fetch on
  // mount, same as the blog and services pages, so a visitor's own browser
  // self-heals a failed or outdated build-time snapshot.
  useEffect(() => {
    let isMounted = true;

    getProjects(lang as AppLang)
      .then((freshProjects) => {
        if (!isMounted) return;
        setProjects(freshProjects.slice(0, HOMEPAGE_PROJECTS_LIMIT));
      })
      .catch(() => {
        // Keep whatever was already rendered (prerendered or previous fetch).
      });

    return () => {
      isMounted = false;
    };
  }, [lang]);

  return (
    <>
      <section className="relative min-h-svh overflow-hidden" data-home-hero>
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full origin-bottom-left object-cover object-[center_38%] md:scale-105"
          autoPlay
          muted
          loop
          playsInline
          crossOrigin="anonymous"
          poster={HERO_VIDEO_POSTER_URL}
          preload="auto"
          aria-hidden="true"
        >
          <source src={HERO_VIDEO_URL} type="video/webm" />
        </video>

        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,15,25,0.18)_0%,rgba(11,15,25,0.42)_42%,rgba(11,15,25,1)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,0,127,0.18),transparent_40%)]" />

        <div className="relative mx-auto flex min-h-svh w-full max-w-6xl flex-col justify-end px-6 pt-32 pb-16 sm:pb-20 md:justify-center md:pt-24 md:pb-14 lg:justify-end lg:pt-32 lg:pb-24">
          <div className="max-w-4xl pb-4 sm:pb-8">
            <h1 className="hero-motto max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
              <Trans
                i18nKey="hero.slogan"
                components={{
                  engineered: <span className="hero-emphasis hero-emphasis-warm" />,
                  designed: <span className="hero-emphasis hero-emphasis-accent" />,
                }}
              />
            </h1>
            <p className="hero-support mt-6 max-w-xl text-sm leading-7 text-white/72 sm:text-base">
              {t("hero.supportingLine")}
            </p>

            <div className="mt-8">
              <ConversionCtaButton href={langHref("/contact")} ariaLabel={t("hero.ctaAriaLabel")}>
                {t("hero.ctaLabel")}
              </ConversionCtaButton>
            </div>
          </div>
        </div>

        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-16 w-full bg-[linear-gradient(100deg,var(--color-secondary-warm),var(--color-accent))] [clip-path:polygon(0_0,100%_0,100%_70%,0_100%)] sm:h-24 md:h-32"
        />
      </section>

      <section
        className="mx-auto flex min-h-svh w-full max-w-6xl flex-col items-center justify-center px-6 py-16 sm:py-20"
        data-reveal
      >
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {t("homeFlow.technology.title")}
          </h2>
          <p className="mt-4 text-base leading-8 text-white/80 sm:text-lg">
            {t("homeFlow.technology.text")}
          </p>

          <div className="mt-6 flex items-center justify-center gap-2">
            {TECHNOLOGY_TEASER_LOGOS.map((logo) => (
              <TechnologyLogo key={logo} name={logo} className="size-5 opacity-80" />
            ))}
          </div>

          <a
            href={langHref("/technology")}
            className="mt-6 inline-flex items-center text-sm font-semibold tracking-[0.08em] text-(--accent) uppercase transition-colors hover:text-(--primary)"
          >
            {t("homeFlow.technology.cta")}
          </a>
        </div>
      </section>

      <section
        id="projects"
        className="mx-auto flex min-h-svh w-full max-w-6xl flex-col items-center justify-center px-6 py-16 sm:py-20"
        data-reveal
      >
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {t("homeFlow.projects.title")}
          </h2>
          <p className="mt-4 text-base leading-8 text-white/80 sm:text-lg">
            {t("homeFlow.projects.text")}
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {PROJECT_BADGES.map(({ key, Icon }) => (
              <span
                key={key}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/8 px-3 py-1.5 text-xs font-semibold tracking-[0.1em] text-white/85 uppercase backdrop-blur-sm"
              >
                <Icon className="size-3.5 text-(--accent)" aria-hidden="true" />
                {t(`homeFlow.projects.badges.${key}`)}
              </span>
            ))}
          </div>
        </div>

        <ProjectsPreviewCarousel
          projects={projects}
          prevAriaLabel={t("homeFlow.projects.carousel.prevAria")}
          nextAriaLabel={t("homeFlow.projects.carousel.nextAria")}
          goToAriaLabel={(index) => t("homeFlow.projects.carousel.goToAria", { index })}
          previewAlt={(name) => t("homeFlow.projects.carousel.previewAlt", { title: name })}
        />

        <div className="text-center">
          <a
            href={langHref("/projects")}
            className="mt-6 inline-flex items-center text-sm font-semibold tracking-[0.08em] text-(--color-secondary-warm) uppercase transition-colors hover:text-(--color-secondary-hot)"
          >
            {t("homeFlow.projects.cta")}
          </a>
        </div>
      </section>

      <section
        id="services"
        className="mx-auto flex min-h-svh w-full max-w-6xl flex-col items-center justify-center px-6 py-16 sm:py-20"
        data-reveal
      >
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {t("homeFlow.services.title")}
          </h2>
          <p className="mt-4 text-base leading-8 text-white/80 sm:text-lg">
            {t("homeFlow.services.text")}
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {SERVICE_BADGES.map(({ key, Icon }) => (
              <span
                key={key}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/8 px-3 py-1.5 text-xs font-semibold tracking-[0.1em] text-white/85 uppercase backdrop-blur-sm"
              >
                <Icon className="size-3.5 text-(--color-secondary-warm)" aria-hidden="true" />
                {t(`homeFlow.services.badges.${key}`)}
              </span>
            ))}

            <span className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-white/20 bg-white/4 px-3 py-1.5 text-xs font-semibold tracking-[0.1em] text-white/55 uppercase">
              <SparklesIcon className="size-3.5 text-white/45" aria-hidden="true" />
              {t("homeFlow.services.badges.readyMade")}
              <span className="text-white/35 normal-case">
                · {t("homeFlow.services.badges.comingSoon")}
              </span>
            </span>
          </div>

          <a
            href={langHref("/services")}
            className="mt-6 inline-flex items-center text-sm font-semibold tracking-[0.08em] text-(--accent) uppercase transition-colors hover:text-(--primary)"
          >
            {t("homeFlow.services.cta")}
          </a>
        </div>
      </section>

      <section
        className="mx-auto flex min-h-svh w-full max-w-6xl flex-col items-center justify-center px-6 py-16 sm:py-20"
        data-reveal
      >
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {t("homeFlow.about.title")}
          </h2>
          <p className="mt-4 text-base leading-8 text-white/80 sm:text-lg">
            {t("homeFlow.about.text")}
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {ABOUT_BADGES.map(({ key, Icon }) => (
              <span
                key={key}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/8 px-3 py-1.5 text-xs font-semibold tracking-[0.1em] text-white/85 uppercase backdrop-blur-sm"
              >
                <Icon className="size-3.5 text-(--accent)" aria-hidden="true" />
                {t(`homeFlow.about.badges.${key}`)}
              </span>
            ))}
          </div>

          <a
            href={langHref("/about")}
            className="mt-6 inline-flex items-center text-sm font-semibold tracking-[0.08em] text-(--color-secondary-warm) uppercase transition-colors hover:text-(--color-secondary-hot)"
          >
            {t("homeFlow.about.cta")}
          </a>
        </div>
      </section>

      <section id="reviews" className="relative" data-reveal>
        <div
          className="absolute inset-0 bg-[linear-gradient(140deg,rgba(11,15,25,0.94),rgba(15,21,40,0.98))] [mask-image:linear-gradient(to_bottom,transparent,black_12%,black_88%,transparent)] [-webkit-mask-image:linear-gradient(to_bottom,transparent,black_12%,black_88%,transparent)]"
          aria-hidden="true"
        />
        <div className="relative mx-auto flex min-h-svh w-full max-w-6xl flex-col items-center justify-center px-6 py-16 sm:py-20">
          <div className="mx-auto mb-8 max-w-3xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              {t("reviewsPage.sectionTitle")}
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-200 sm:text-lg">
              {t("reviewsPage.sectionText")}
            </p>
          </div>

          <ReviewsCarousel
            title={t("reviewsPage.carouselTitle")}
            emptyRatingText={t("reviewsPage.emptyRatingText")}
            actionLabel={t("reviewsPage.actionLabel")}
            actionAriaLabel={t("reviewsPage.actionAriaLabel")}
          />
        </div>
      </section>
    </>
  );
}
