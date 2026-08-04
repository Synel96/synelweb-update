import { useEffect, useRef } from "react";
import { GaugeIcon } from "lucide-react";
import { Trans, useTranslation } from "react-i18next";
import { usePageContext } from "vike-react/usePageContext";
import { ConversionCtaButton } from "@/components/ConversionCtaButton";
import { ReviewsCarousel } from "@/components/ReviewsCarousel";
import { TechnologyLogo } from "@/components/TechnologyLogo";
import { cloudinaryVideoUrl } from "@/src/cloudinary";
import { DEFAULT_LANG, type SupportedLang } from "@/src/i18n-config";
import { localizePath } from "@/src/localizedRoutes";
import { useScrollReveal } from "@/src/hooks/use-scroll-reveal";

type SectionTone = "accent" | "warm";

const SECTION_TONE_BACKGROUND: Record<SectionTone, string> = {
  accent:
    "bg-[var(--section-surface-accent)] bg-[radial-gradient(circle_at_50%_12%,var(--section-glow-accent),transparent_55%)]",
  warm: "bg-[var(--section-surface-warm)] bg-[radial-gradient(circle_at_50%_12%,var(--section-glow-warm),transparent_55%)]",
};

const SECTION_TONE_HEADING: Record<SectionTone, string> = {
  accent: "[text-shadow:0_0_36px_var(--section-glow-accent)]",
  warm: "[text-shadow:0_0_36px_var(--section-glow-warm)]",
};

const SECTION_TONE_CTA: Record<SectionTone, string> = {
  accent: "text-(--accent) hover:text-(--primary)",
  // Magenta pops against the warm/orange section backdrop; the same
  // orange-on-orange combo used elsewhere would have too little contrast here.
  warm: "text-(--accent) hover:text-(--color-secondary-hot)",
};

const HERO_TECH_LOGOS = ["react", "typescript", "tailwind", "django"] as const;

const HERO_VIDEO_UPLOAD_PATH = "f_auto,q_auto/v1782411197/hero_wujueq.webm";
const HERO_VIDEO_URL = cloudinaryVideoUrl(HERO_VIDEO_UPLOAD_PATH);
const HERO_VIDEO_POSTER_URL =
  "https://res.cloudinary.com/dmwulp3dl/image/upload/f_auto,q_auto:low,w_960,c_limit,dpr_auto/v1784120435/coverr-temp-sftfwatermarkedvideo00436be495bc341e4b7274f83a560daa2mp4-5896-1080p_1__exported_0_dkidt5.webp";

export default function Page() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { t } = useTranslation();
  const pageContext = usePageContext() as { lang?: SupportedLang };
  const lang = pageContext.lang ?? DEFAULT_LANG;

  const technologyReveal = useScrollReveal<HTMLDivElement>();
  const projectsReveal = useScrollReveal<HTMLDivElement>();
  const servicesReveal = useScrollReveal<HTMLDivElement>();
  const aboutReveal = useScrollReveal<HTMLDivElement>();
  const reviewsReveal = useScrollReveal<HTMLDivElement>();

  const langHref = (href: string) =>
    href.startsWith("/#") ? `/${lang}/${href.slice(1)}` : localizePath(href, lang);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.playbackRate = 0.75;
  }, []);

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

        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,15,25,0.18)_0%,rgba(11,15,25,0.42)_42%,rgba(11,15,25,0.88)_100%)]" />
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

            <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-6">
              <ConversionCtaButton href={langHref("/contact")} ariaLabel={t("hero.ctaAriaLabel")}>
                {t("hero.ctaLabel")}
              </ConversionCtaButton>

              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/8 px-3 py-1.5 text-xs font-semibold tracking-[0.1em] text-white/85 uppercase backdrop-blur-sm">
                  <GaugeIcon
                    className="size-3.5 text-(--color-secondary-warm)"
                    aria-hidden="true"
                  />
                  {t("hero.performanceBadge")}
                </span>

                <div className="flex items-center gap-2">
                  {HERO_TECH_LOGOS.map((logo) => (
                    <TechnologyLogo key={logo} name={logo} className="size-5 opacity-80" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className={`flex min-h-svh w-full flex-col items-center justify-center px-6 py-20 ${SECTION_TONE_BACKGROUND.accent}`}
      >
        <div ref={technologyReveal} className="mx-auto w-full max-w-3xl text-center" data-reveal>
          <h2
            className={`text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl ${SECTION_TONE_HEADING.accent}`}
          >
            {t("homeFlow.technology.title")}
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/80 sm:text-lg">
            {t("homeFlow.technology.text")}
          </p>
          <a
            href={langHref("/technology")}
            className={`mt-8 inline-flex items-center text-sm font-semibold tracking-[0.08em] uppercase transition-colors ${SECTION_TONE_CTA.accent}`}
          >
            {t("homeFlow.technology.cta")}
          </a>
        </div>
      </section>

      <section
        id="projects"
        className={`flex min-h-svh w-full flex-col items-center justify-center px-6 py-20 ${SECTION_TONE_BACKGROUND.warm}`}
      >
        <div ref={projectsReveal} className="mx-auto w-full max-w-3xl text-center" data-reveal>
          <h2
            className={`text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl ${SECTION_TONE_HEADING.warm}`}
          >
            {t("homeFlow.projects.title")}
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/80 sm:text-lg">
            {t("homeFlow.projects.text")}
          </p>
          <a
            href={langHref("/projects")}
            className={`mt-8 inline-flex items-center text-sm font-semibold tracking-[0.08em] uppercase transition-colors ${SECTION_TONE_CTA.warm}`}
          >
            {t("homeFlow.projects.cta")}
          </a>
        </div>
      </section>

      <section
        id="services"
        className={`flex min-h-svh w-full flex-col items-center justify-center px-6 py-20 ${SECTION_TONE_BACKGROUND.accent}`}
      >
        <div ref={servicesReveal} className="mx-auto w-full max-w-3xl text-center" data-reveal>
          <h2
            className={`text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl ${SECTION_TONE_HEADING.accent}`}
          >
            {t("homeFlow.services.title")}
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/80 sm:text-lg">
            {t("homeFlow.services.text")}
          </p>
          <a
            href={langHref("/services")}
            className={`mt-8 inline-flex items-center text-sm font-semibold tracking-[0.08em] uppercase transition-colors ${SECTION_TONE_CTA.accent}`}
          >
            {t("homeFlow.services.cta")}
          </a>
        </div>
      </section>

      <section
        className={`flex min-h-svh w-full flex-col items-center justify-center px-6 py-20 ${SECTION_TONE_BACKGROUND.warm}`}
      >
        <div ref={aboutReveal} className="mx-auto w-full max-w-3xl text-center" data-reveal>
          <h2
            className={`text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl ${SECTION_TONE_HEADING.warm}`}
          >
            {t("homeFlow.about.title")}
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/80 sm:text-lg">
            {t("homeFlow.about.text")}
          </p>
          <a
            href={langHref("/about")}
            className={`mt-8 inline-flex items-center text-sm font-semibold tracking-[0.08em] uppercase transition-colors ${SECTION_TONE_CTA.warm}`}
          >
            {t("homeFlow.about.cta")}
          </a>
        </div>
      </section>

      <section
        id="reviews"
        className={`flex min-h-svh w-full flex-col items-center justify-center px-6 py-20 ${SECTION_TONE_BACKGROUND.accent}`}
      >
        <div ref={reviewsReveal} className="mx-auto w-full max-w-4xl" data-reveal>
          <div className="mb-8 text-center">
            <h2
              className={`text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl ${SECTION_TONE_HEADING.accent}`}
            >
              {t("reviewsPage.sectionTitle")}
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-200 sm:text-lg">
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
