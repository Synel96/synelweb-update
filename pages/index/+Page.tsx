import { useEffect, useRef } from "react";
import { Trans, useTranslation } from "react-i18next";
import { cloudinaryVideoUrl } from "@/src/cloudinary";

const HERO_VIDEO_UPLOAD_PATH = "f_auto,q_auto/v1782411197/hero_wujueq.webm";
const HERO_VIDEO_URL = cloudinaryVideoUrl(HERO_VIDEO_UPLOAD_PATH);

export default function Page() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { t } = useTranslation();

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
          preload="auto"
          aria-hidden="true"
        >
          <source src={HERO_VIDEO_URL} type="video/webm" />
        </video>

        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,15,25,0.18)_0%,rgba(11,15,25,0.42)_42%,rgba(11,15,25,0.88)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,0,127,0.18),transparent_40%)]" />

        <div className="relative mx-auto flex min-h-svh w-full max-w-6xl flex-col justify-end px-6 pt-32 pb-16 sm:pb-20 lg:pb-24">
          <div className="max-w-4xl pb-4 sm:pb-8">
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
              <Trans
                i18nKey="hero.slogan"
                components={{
                  engineered: <span className="hero-emphasis hero-emphasis-warm" />,
                  designed: <span className="hero-emphasis hero-emphasis-accent" />,
                }}
              />
            </h1>
            <p className="mt-6 max-w-xl text-sm leading-7 text-white/72 sm:text-base">
              {t("hero.supportingLine")}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
