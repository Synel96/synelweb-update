import { useEffect, useRef } from "react";
import { Trans, useTranslation } from "react-i18next";
import { usePageContext } from "vike-react/usePageContext";
import { ReviewsCarousel } from "@/components/ReviewsCarousel";
import { cloudinaryVideoUrl } from "@/src/cloudinary";
import { DEFAULT_LANG, type SupportedLang } from "@/src/i18n-config";

const HERO_VIDEO_UPLOAD_PATH = "f_auto,q_auto/v1782411197/hero_wujueq.webm";
const HERO_VIDEO_URL = cloudinaryVideoUrl(HERO_VIDEO_UPLOAD_PATH);
const HERO_VIDEO_POSTER_URL =
  "https://res.cloudinary.com/dmwulp3dl/image/upload/f_auto,q_auto:low,w_960,c_limit,dpr_auto/v1784120435/coverr-temp-sftfwatermarkedvideo00436be495bc341e4b7274f83a560daa2mp4-5896-1080p_1__exported_0_dkidt5.webp";

export default function Page() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { t } = useTranslation();
  const pageContext = usePageContext() as { lang?: SupportedLang };
  const lang = pageContext.lang ?? DEFAULT_LANG;

  const langHref = (href: string) => {
    if (href === "/") return `/${lang}/`;
    if (href.startsWith("/#")) return `/${lang}/${href.slice(1)}`;
    return `/${lang}${href}`;
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.playbackRate = 0.75;
  }, []);

  return (
    <>
      <section className="relative min-h-svh overflow-hidden">
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover object-[center_38%]"
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

        <div className="relative mx-auto flex min-h-svh w-full max-w-6xl flex-col justify-end px-6 pt-32 pb-16 sm:pb-20 lg:pb-24">
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
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-16 sm:py-20" data-reveal>
        <article className="rounded-3xl border border-white/10 bg-[linear-gradient(150deg,rgba(16,22,42,0.9),rgba(12,18,33,0.95))] p-7 sm:p-9">
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {t("homeFlow.technology.title")}
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-8 text-white/80 sm:text-lg">
            {t("homeFlow.technology.text")}
          </p>
          <a
            href={langHref("/technology")}
            className="mt-6 inline-flex items-center text-sm font-semibold tracking-[0.08em] text-(--accent) uppercase transition-colors hover:text-(--primary)"
          >
            {t("homeFlow.technology.cta")}
          </a>
        </article>
      </section>

      <section id="projects" className="mx-auto w-full max-w-6xl px-6 py-16 sm:py-20" data-reveal>
        <article className="rounded-3xl border border-white/10 bg-[linear-gradient(145deg,rgba(9,14,24,0.92),rgba(14,20,38,0.98))] p-7 sm:p-9">
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {t("homeFlow.projects.title")}
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-8 text-white/80 sm:text-lg">
            {t("homeFlow.projects.text")}
          </p>

          <a
            href={langHref("/projects")}
            className="mt-7 inline-flex items-center text-sm font-semibold tracking-[0.08em] text-(--accent) uppercase transition-colors hover:text-(--primary)"
          >
            {t("homeFlow.projects.cta")}
          </a>
        </article>
      </section>

      <section id="services" className="mx-auto w-full max-w-6xl px-6 py-16 sm:py-20" data-reveal>
        <article className="rounded-3xl border border-white/10 bg-[linear-gradient(150deg,rgba(16,22,42,0.88),rgba(15,21,40,0.95))] p-7 sm:p-9">
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {t("homeFlow.services.title")}
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-8 text-white/80 sm:text-lg">
            {t("homeFlow.services.text")}
          </p>
          <a
            href={langHref("/services")}
            className="mt-6 inline-flex items-center text-sm font-semibold tracking-[0.08em] text-(--accent) uppercase transition-colors hover:text-(--primary)"
          >
            {t("homeFlow.services.cta")}
          </a>
        </article>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-16 sm:py-20" data-reveal>
        <article className="rounded-3xl border border-white/10 bg-[linear-gradient(155deg,rgba(12,18,33,0.95),rgba(10,15,27,0.95))] p-7 sm:p-9">
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {t("homeFlow.about.title")}
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-8 text-white/80 sm:text-lg">
            {t("homeFlow.about.text")}
          </p>
          <a
            href={langHref("/about")}
            className="mt-6 inline-flex items-center text-sm font-semibold tracking-[0.08em] text-(--accent) uppercase transition-colors hover:text-(--primary)"
          >
            {t("homeFlow.about.cta")}
          </a>
        </article>
      </section>

      <section
        id="reviews"
        className="border-y border-white/10 bg-[linear-gradient(140deg,rgba(11,15,25,0.94),rgba(15,21,40,0.98))]"
        data-reveal
      >
        <div className="mx-auto w-full max-w-6xl px-6 py-16 sm:py-20">
          <div className="mb-8 max-w-4xl">
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
