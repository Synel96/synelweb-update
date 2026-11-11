import { useEffect, useRef, useState } from "react";
import {
  ArrowRightIcon,
  BriefcaseIcon,
  ChartNoAxesColumnIcon,
  Code2Icon,
  ExternalLinkIcon,
  GaugeIcon,
  HandshakeIcon,
  LanguagesIcon,
  MapPinIcon,
  RocketIcon,
  SearchIcon,
  ShieldCheckIcon,
  ShoppingCartIcon,
  SparklesIcon,
  VideoIcon,
  type LucideIcon,
} from "lucide-react";
import { Trans, useTranslation } from "react-i18next";
import { usePageContext } from "vike-react/usePageContext";
import { ConversionCtaButton } from "@/components/ConversionCtaButton";
import { ProjectsPreviewCarousel } from "@/components/ProjectsPreviewCarousel";
import { ReviewsCarousel } from "@/components/ReviewsCarousel";
import { TechnologyLogo } from "@/components/TechnologyLogo";
import { cloudinaryVideoUrl } from "@/src/cloudinary";
import { prefersReducedMotion } from "@/src/prefersReducedMotion";
import { useBackgroundVideo } from "@/src/hooks/use-background-video";
import { DEFAULT_LANG, type SupportedLang } from "@/src/i18n-config";
import { localizePath } from "@/src/localizedRoutes";
import { quoteFormHref } from "@/src/quoteForm";
import { trackEvent } from "@/src/analytics";
import { getProjects, type Project } from "@/src/services/projectServices";
import type { Review } from "@/src/services/reviewsService";
import type { AppLang } from "@/src/services/serviceCardsService";

type Data = {
  projects: Project[];
  fetchError: boolean;
  reviews: Review[];
  reviewsFetchError: boolean;
};

// Product names, not translated.
const TECHNOLOGY_TEASER = [
  { logo: "react", name: "React" },
  { logo: "typescript", name: "TypeScript" },
  { logo: "tailwind", name: "Tailwind" },
  { logo: "python", name: "Python" },
  { logo: "django", name: "Django" },
  { logo: "postgresql", name: "PostgreSQL" },
] as const;

// Tighter on phones: the page is long there, and the full desktop rhythm
// left a lot of empty scrolling between sections.
const SECTION_CLASS = "mx-auto w-full max-w-6xl px-6 py-12 sm:py-20";

function SectionHeader({ label, title, text }: { label: string; title: string; text: string }) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <p className="fancy-eyebrow text-xs font-semibold tracking-[0.2em] text-(--accent) uppercase">
        {label}
      </p>
      <h2 className="mt-4 text-3xl font-semibold tracking-tight text-balance text-white sm:text-4xl">
        {title}
      </h2>
      <p className="mt-4 text-base leading-8 text-pretty text-white/80 sm:text-lg">{text}</p>
    </div>
  );
}

// Equal-width cells instead of a centred flex-wrap, which left a lone badge
// on the last line at most widths. Two columns on phones, where badge text
// may wrap inside its cell, so every badge is visible without scrolling.
function BadgeGrid({ className, children }: { className: string; children: React.ReactNode }) {
  return (
    <ul className={`mx-auto mt-6 grid max-w-5xl grid-cols-2 gap-2 sm:gap-2.5 ${className}`}>
      {children}
    </ul>
  );
}

function Badge({
  Icon,
  label,
  className = "",
}: {
  Icon: LucideIcon;
  label: string;
  className?: string;
}) {
  return (
    <li
      className={`fancy-chip flex items-center justify-center gap-2 rounded-2xl px-3 py-2 text-center text-[0.65rem] leading-snug font-semibold tracking-[0.08em] text-white/85 uppercase sm:rounded-full sm:text-xs sm:tracking-[0.1em] ${className}`}
    >
      <Icon className="size-3.5 shrink-0 text-(--accent)" aria-hidden="true" />
      {label}
    </li>
  );
}

function SectionLink({
  href,
  label,
  warm = false,
}: {
  href: string;
  label: string;
  warm?: boolean;
}) {
  return (
    <div className="mt-8 text-center">
      <a
        href={href}
        className={`inline-flex items-center text-sm font-semibold tracking-[0.08em] uppercase transition-colors ${
          warm
            ? "text-(--color-secondary-warm) hover:text-(--color-secondary-hot)"
            : "text-(--accent) hover:text-(--primary)"
        }`}
      >
        {label}
      </a>
    </div>
  );
}

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
  { key: "multilingual", Icon: LanguagesIcon },
  { key: "onlineMeetings", Icon: VideoIcon },
  { key: "cookieFreeAnalytics", Icon: ChartNoAxesColumnIcon },
] as const;

const VIDEO_FADE_MS = 700;

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

  // The video only gets its source once the page has loaded (the poster
  // shows until then): with the source in the markup, the browser started
  // downloading the multi-megabyte video straight away, competing with the
  // page's own files and the poster (the LCP) for bandwidth, which made the
  // mobile PageSpeed score swing from run to run. Visitors who ask for less
  // motion or less data keep the poster.
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  // Set when the video can't be played here: it fades out over the poster
  // copy behind it instead of snapping from the last frame to the poster.
  const [videoFailed, setVideoFailed] = useState(false);

  useEffect(() => {
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } })
      .connection;
    if (prefersReducedMotion() || connection?.saveData) return;

    const start = () => setVideoSrc(HERO_VIDEO_URL);
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    return () => window.removeEventListener("load", start);
  }, []);

  // Keeps it playing after the browser pauses it (screen lock, app switch),
  // pauses it off screen, and restarts it if it stalls. If it can't be
  // played at all, the source goes and the poster shows instead of a frozen
  // frame.
  useBackgroundVideo(videoRef, videoSrc !== null, () => {
    setVideoFailed(true);
    window.setTimeout(() => {
      setVideoSrc(null);
      videoRef.current?.load();
    }, VIDEO_FADE_MS);
  });

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // The default rate, not the current one: loading a new source resets
    // playbackRate to it.
    video.defaultPlaybackRate = 0.75;
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
        {/* The poster again, under the video: whenever the video has no frame
            to show (giving up, or a browser briefly blanking it on resume),
            this is what shows through, not the page background. */}
        <img
          src={HERO_VIDEO_POSTER_URL}
          alt=""
          aria-hidden="true"
          decoding="sync"
          className="absolute inset-0 h-full w-full origin-bottom-left object-cover object-[center_38%] md:scale-105"
        />
        <video
          ref={videoRef}
          className={`absolute inset-0 h-full w-full origin-bottom-left object-cover object-[center_38%] transition-opacity duration-700 md:scale-105 ${
            videoFailed ? "opacity-0" : "opacity-100"
          }`}
          src={videoSrc ?? undefined}
          muted
          loop
          playsInline
          crossOrigin="anonymous"
          poster={HERO_VIDEO_POSTER_URL}
          preload="auto"
          aria-hidden="true"
          // Starts once enough has buffered to play through without stalling.
          onCanPlayThrough={(event) => void event.currentTarget.play().catch(() => {})}
        />

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
              <ConversionCtaButton
                href={quoteFormHref(lang)}
                ariaLabel={t("hero.ctaAriaLabel")}
                onClick={() => trackEvent("quote_cta_click", { location: "home_hero" })}
              >
                {t("hero.ctaLabel")}
              </ConversionCtaButton>
            </div>
          </div>
        </div>
      </section>

      <div
        aria-hidden="true"
        className="h-16 w-full bg-[linear-gradient(100deg,var(--color-secondary-warm),var(--color-accent))] blur-[6px] [clip-path:polygon(0_0,100%_0,100%_70%,0_100%)] sm:h-24 sm:blur-[8px] md:h-32"
      />

      <section className={SECTION_CLASS} data-reveal>
        <SectionHeader
          label={t("homeFlow.technology.label")}
          title={t("homeFlow.technology.title")}
          text={t("homeFlow.technology.text")}
        />

        <ul className="mx-auto mt-8 grid max-w-4xl grid-cols-3 gap-3 sm:grid-cols-6">
          {TECHNOLOGY_TEASER.map(({ logo, name }) => (
            <li
              key={logo}
              className="fancy-tile flex flex-col items-center gap-2.5 rounded-2xl px-2 py-4"
            >
              <TechnologyLogo name={logo} className="size-9" />
              <span className="text-[0.7rem] font-semibold tracking-[0.06em] text-white/70">
                {name}
              </span>
            </li>
          ))}
        </ul>

        <SectionLink href={langHref("/technology")} label={t("homeFlow.technology.cta")} />
      </section>

      <section id="projects" className={SECTION_CLASS} data-reveal>
        <SectionHeader
          label={t("homeFlow.projects.label")}
          title={t("homeFlow.projects.title")}
          text={t("homeFlow.projects.text")}
        />

        <BadgeGrid className="sm:grid-cols-3">
          {PROJECT_BADGES.map(({ key, Icon }, index) => (
            <Badge
              key={key}
              Icon={Icon}
              label={t(`homeFlow.projects.badges.${key}`)}
              className={index === 0 ? "col-span-2 sm:col-span-1" : ""}
            />
          ))}
        </BadgeGrid>

        <ProjectsPreviewCarousel
          projects={projects}
          prevAriaLabel={t("homeFlow.projects.carousel.prevAria")}
          nextAriaLabel={t("homeFlow.projects.carousel.nextAria")}
          goToAriaLabel={(index) => t("homeFlow.projects.carousel.goToAria", { index })}
        />

        <SectionLink href={langHref("/projects")} label={t("homeFlow.projects.cta")} warm />
      </section>

      <section id="services" className={SECTION_CLASS} data-reveal>
        <SectionHeader
          label={t("homeFlow.services.label")}
          title={t("homeFlow.services.title")}
          text={t("homeFlow.services.text")}
        />

        <ul className="mx-auto mt-8 grid max-w-4xl grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {SERVICE_BADGES.map(({ key, Icon }) => (
            <li key={key}>
              <a
                href={langHref("/services")}
                className="fancy-card fancy-card-lift group flex h-full flex-col items-start gap-4 rounded-2xl p-4 sm:p-5"
              >
                <span className="flex size-11 items-center justify-center rounded-xl bg-linear-135 from-(--color-secondary-warm) to-(--color-accent) text-[#140814] shadow-[0_10px_24px_-12px_var(--accent-glow)]">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <span className="flex w-full items-center justify-between gap-2 text-sm font-semibold text-white sm:text-base">
                  {t(`homeFlow.services.badges.${key}`)}
                  <ArrowRightIcon
                    className="size-4 shrink-0 text-white/40 transition-[translate,color] duration-300 group-hover:translate-x-0.5 group-hover:text-(--accent)"
                    aria-hidden="true"
                  />
                </span>
              </a>
            </li>
          ))}
        </ul>

        <p className="mt-5 flex items-center justify-center gap-1.5 text-xs font-semibold tracking-[0.1em] text-white/50 uppercase">
          <SparklesIcon className="size-3.5 text-white/40" aria-hidden="true" />
          {t("homeFlow.services.badges.readyMade")}
          <span className="text-white/35 normal-case">
            · {t("homeFlow.services.badges.comingSoon")}
          </span>
        </p>

        <SectionLink href={langHref("/services")} label={t("homeFlow.services.cta")} />
      </section>

      <section className={SECTION_CLASS} data-reveal>
        <SectionHeader
          label={t("homeFlow.about.label")}
          title={t("homeFlow.about.title")}
          text={t("homeFlow.about.text")}
        />

        <BadgeGrid className="lg:grid-cols-3">
          {ABOUT_BADGES.map(({ key, Icon }) => (
            <Badge key={key} Icon={Icon} label={t(`homeFlow.about.badges.${key}`)} />
          ))}
        </BadgeGrid>

        <SectionLink href={langHref("/about")} label={t("homeFlow.about.cta")} warm />
      </section>

      <section id="reviews" className="relative" data-reveal>
        <div
          className="absolute inset-0 bg-[linear-gradient(140deg,rgba(11,15,25,0.94),rgba(15,21,40,0.98))] [mask-image:linear-gradient(to_bottom,transparent,black_12%,black_88%,transparent)] [-webkit-mask-image:linear-gradient(to_bottom,transparent,black_12%,black_88%,transparent)]"
          aria-hidden="true"
        />
        <div className="relative mx-auto w-full max-w-6xl px-6 py-12 sm:py-20">
          <div className="mb-8 text-center">
            <h2 className="mx-auto max-w-3xl text-3xl font-semibold tracking-tight text-balance text-white sm:text-4xl">
              {t("reviewsPage.sectionTitle")}
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-base leading-8 text-pretty text-slate-200 sm:text-lg">
              {t("reviewsPage.sectionText")}
            </p>
          </div>

          <ReviewsCarousel
            title={t("reviewsPage.carouselTitle")}
            emptyRatingText={t("reviewsPage.emptyRatingText")}
            actionLabel={t("reviewsPage.actionLabel")}
            actionAriaLabel={t("reviewsPage.actionAriaLabel")}
            initialReviews={pageContext.data?.reviews}
            initialFetchError={pageContext.data?.reviewsFetchError}
          />
        </div>
      </section>
    </>
  );
}
