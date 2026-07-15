import type { ComponentType } from "react";
import { MapPinnedIcon, MailIcon, PhoneIcon, RouteIcon, SparklesIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { ConversionCtaButton } from "@/components/ConversionCtaButton";

const EMAIL = "info@synleweb.hu";
const PHONE = "+36303645516";
const FACEBOOK_HREF = "https://www.facebook.com/profile.php?id=61586963195763";
const LINKEDIN_HREF = "https://www.linkedin.com/in/szilveszter-nemeth-636689332/";
const SOPRON_MAP_HREF = "https://www.google.com/maps?q=Sopron&z=14&output=embed";

function ContactPill({
  icon: Icon,
  title,
  text,
}: {
  icon: ComponentType<{ className?: string }>;
  title: string;
  text: string;
}) {
  return (
    <article className="bento-card rounded-2xl p-5">
      <div className="flex items-center gap-3">
        <span className="flex size-11 items-center justify-center rounded-xl bg-white/10 text-(--accent)">
          <Icon className="size-5" />
        </span>
        <div>
          <h3 className="text-base font-semibold text-(--brand-on-surface)">{title}</h3>
          <p className="text-sm text-white/72">{text}</p>
        </div>
      </div>
    </article>
  );
}

export default function Page() {
  const { t } = useTranslation();

  return (
    <div className="text-(--brand-on-surface)">
      <section className="mx-auto w-full max-w-6xl px-6 pt-36 pb-12 sm:pt-40 sm:pb-16 lg:pb-20" data-reveal>
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div className="space-y-6">
            <p className="text-sm font-semibold tracking-[0.24em] text-(--accent) uppercase">
              {t("contact.label")}
            </p>
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              {t("contact.heading")}
            </h1>
            <p className="max-w-2xl text-base leading-8 text-white/78 sm:text-lg">
              {t("contact.intro")}
            </p>
            <p className="max-w-2xl text-base leading-8 font-semibold text-white sm:text-lg">
              {t("contact.introStrong")}
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
              <ConversionCtaButton href={`tel:${PHONE}`} ariaLabel={t("contact.callButton")}>
                {t("contact.callButton")}
              </ConversionCtaButton>
              <ConversionCtaButton href={`mailto:${EMAIL}`} ariaLabel={t("contact.emailButton")}>
                {t("contact.emailButton")}
              </ConversionCtaButton>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-14 rounded-[1.15rem] border-white/15 bg-white/5 px-6 text-white hover:bg-white/10"
              >
                <a href="#map">
                  <span className="flex items-center gap-2">
                    <RouteIcon className="size-4" />
                    {t("contact.mapLabel")}
                  </span>
                </a>
              </Button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            <ContactPill
              icon={SparklesIcon}
              title={t("contact.responseLabel")}
              text={t("contact.responseText")}
            />
            <ContactPill
              icon={MapPinnedIcon}
              title={t("contact.locationLabel")}
              text={t("contact.locationText")}
            />
            <ContactPill
              icon={MailIcon}
              title={t("contact.supportLabel")}
              text={t("contact.supportText")}
            />
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 pb-16 sm:pb-20" data-reveal>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <a
            href={`tel:${PHONE}`}
            className="bento-card is-featured rounded-2xl p-5 transition-transform duration-300 hover:-translate-y-0.5"
          >
            <div className="flex items-center gap-3 text-(--accent)">
              <PhoneIcon className="size-5" />
              <span className="text-xs font-semibold tracking-[0.2em] uppercase">
                {t("contact.callButton")}
              </span>
            </div>
            <p className="mt-4 text-2xl font-semibold text-white">{PHONE}</p>
            <p className="mt-2 text-sm leading-6 text-white/75">{t("contact.callCardText")}</p>
          </a>

          <a
            href={`mailto:${EMAIL}`}
            className="bento-card rounded-2xl p-5 transition-transform duration-300 hover:-translate-y-0.5"
          >
            <div className="flex items-center gap-3 text-(--accent)">
              <MailIcon className="size-5" />
              <span className="text-xs font-semibold tracking-[0.2em] uppercase">
                {t("contact.emailButton")}
              </span>
            </div>
            <p className="mt-4 text-2xl font-semibold text-white">{EMAIL}</p>
            <p className="mt-2 text-sm leading-6 text-white/75">{t("contact.emailCardText")}</p>
          </a>

          <a
            href={FACEBOOK_HREF}
            target="_blank"
            rel="noreferrer"
            className="bento-card rounded-2xl p-5 transition-transform duration-300 hover:-translate-y-0.5"
          >
            <div className="flex items-center gap-3 text-(--accent)">
              <span className="flex size-5 items-center justify-center rounded-full border border-current text-[0.65rem] leading-none font-bold">
                f
              </span>
              <span className="text-xs font-semibold tracking-[0.2em] uppercase">
                {t("contact.facebookButton")}
              </span>
            </div>
            <p className="mt-4 text-sm leading-6 text-white/75">{t("contact.facebookCardText")}</p>
          </a>

          <a
            href={LINKEDIN_HREF}
            target="_blank"
            rel="noreferrer"
            className="bento-card rounded-2xl p-5 transition-transform duration-300 hover:-translate-y-0.5"
          >
            <div className="flex items-center gap-3 text-(--accent)">
              <span className="flex size-5 items-center justify-center rounded-full border border-current text-[0.65rem] leading-none font-bold">
                in
              </span>
              <span className="text-xs font-semibold tracking-[0.2em] uppercase">
                {t("contact.linkedinButton")}
              </span>
            </div>
            <p className="mt-4 text-sm leading-6 text-white/75">{t("contact.linkedinCardText")}</p>
          </a>
        </div>
      </section>

      <section id="map" className="mx-auto w-full max-w-6xl px-6 pb-16 sm:pb-20" data-reveal>
        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-stretch">
          <div className="bento-card rounded-3xl p-6 sm:p-8">
            <p className="text-sm font-semibold tracking-[0.22em] text-(--accent) uppercase">
              {t("contact.mapLabel")}
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">
              {t("contact.mapTitle")}
            </h2>
            <p className="mt-4 max-w-xl text-base leading-8 text-white/78">
              {t("contact.mapText")}
            </p>

            <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm font-semibold text-white">{t("contact.mapLocationTitle")}</p>
              <p className="mt-2 text-sm leading-7 text-white/72">{t("contact.mapLocationText")}</p>
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl border border-white/10 bg-black/20 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.75)]">
            <iframe
              title={t("contact.mapTitle")}
              src={SOPRON_MAP_HREF}
              className="h-105 w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      <section
        className="border-y border-white/10 bg-[linear-gradient(140deg,rgba(11,15,25,0.92),rgba(15,21,40,0.96))]"
        data-reveal
      >
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-16 sm:py-20">
          <p className="text-sm font-semibold tracking-[0.24em] text-(--accent) uppercase">
            {t("contact.closingTitle")}
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {t("contact.closingTitle")}
          </h2>
          <p className="max-w-3xl text-base leading-8 text-slate-200 sm:text-lg">
            {t("contact.closingText")}
          </p>
        </div>
      </section>
    </div>
  );
}
