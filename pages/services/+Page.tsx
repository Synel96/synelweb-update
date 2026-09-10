import { useEffect, useRef, useState } from "react";
import { usePageContext } from "vike-react/usePageContext";
import { useTranslation } from "react-i18next";
import {
  DatabaseIcon,
  GlobeIcon,
  ImageIcon,
  MailIcon,
  PenLineIcon,
  RocketIcon,
  StoreIcon,
  TriangleIcon,
} from "lucide-react";
import { PageHeroBackground } from "@/components/PageHeroBackground";
import { ServiceCard } from "@/components/ServiceCard";
import { ServiceCardSkeleton } from "@/components/ServiceCardSkeleton";
import { resolveCurrentLang } from "@/src/localizedRoutes";
import {
  getServiceCards,
  type AppLang,
  type ServiceCard as ServiceCardItem,
} from "@/src/services/serviceCardsService";

const MAINTENANCE_ITEMS = [
  { key: "hosting", Icon: GlobeIcon },
  { key: "email", Icon: MailIcon },
  { key: "googleBusiness", Icon: StoreIcon },
  { key: "content", Icon: PenLineIcon },
  { key: "vercel", Icon: TriangleIcon },
  { key: "flyio", Icon: RocketIcon },
  { key: "neon", Icon: DatabaseIcon },
  { key: "cloudinary", Icon: ImageIcon },
] as const;

// Fixed, manually-set price points (not a live FX conversion) — update by
// hand if the starting package price or exchange rates move meaningfully.
const MAINTENANCE_STARTING_PRICE: Record<
  AppLang,
  { amount: number; currency: string; locale: string }
> = {
  hu: { amount: 25000, currency: "HUF", locale: "hu-HU" },
  en: { amount: 70, currency: "USD", locale: "en-US" },
  de: { amount: 65, currency: "EUR", locale: "de-DE" },
};

function formatMaintenanceStartingPrice(lang: AppLang): string {
  const { amount, currency, locale } = MAINTENANCE_STARTING_PRICE[lang];
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

type Data = {
  cards: ServiceCardItem[];
  fetchError: boolean;
  contactHref: string;
};

function toAppLang(language: string): AppLang {
  const normalized = language.toLowerCase();
  if (normalized.startsWith("hu")) return "hu";
  if (normalized.startsWith("de")) return "de";
  return "en";
}

export default function Page() {
  const pageContext = usePageContext() as { data?: Data; lang?: "en" | "hu" | "de" };
  const initialCards = pageContext.data?.cards ?? [];
  const initialFetchError = pageContext.data?.fetchError ?? true;
  const contactHref = pageContext.data?.contactHref ?? "/contact";
  const { t } = useTranslation();
  const routeLang = resolveCurrentLang(pageContext.lang);
  const appLang = toAppLang(routeLang);
  const maintenanceStartingPrice = formatMaintenanceStartingPrice(appLang);

  const [cards, setCards] = useState<ServiceCardItem[]>(initialCards);
  const [fetchError, setFetchError] = useState(initialFetchError);
  const [isLoading, setIsLoading] = useState(initialCards.length === 0 && !initialFetchError);

  useEffect(() => {
    setCards(initialCards);
    setFetchError(initialFetchError);
    setIsLoading(initialCards.length === 0 && !initialFetchError);
  }, [initialCards, initialFetchError]);

  const cardsRef = useRef(cards);
  useEffect(() => {
    cardsRef.current = cards;
  }, [cards]);

  useEffect(() => {
    let isMounted = true;

    async function refreshCards() {
      try {
        const latestCards = await getServiceCards(appLang);
        if (!isMounted) return;

        setCards(latestCards);
        setFetchError(false);
      } catch {
        if (!isMounted) return;
        // Keep showing the already-loaded (e.g. prerendered) cards instead
        // of blanking the page; only surface the error when there's
        // nothing to fall back to.
        if (cardsRef.current.length === 0) {
          setFetchError(true);
        }
      } finally {
        if (!isMounted) return;
        setIsLoading(false);
      }
    }

    refreshCards();

    return () => {
      isMounted = false;
    };
  }, [routeLang]);

  return (
    <>
      <PageHeroBackground />

      <header className="mx-auto w-full max-w-6xl px-6 pt-36 pb-16 sm:pt-40 sm:pb-14">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold tracking-[0.18em] text-(--accent) uppercase">
            {t("homeFlow.services.label")}
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {t("homeFlow.services.title")}
          </h1>
          <p className="mt-4 text-left text-base leading-8 text-white/80 sm:text-lg">
            {t("homeFlow.services.text")}
          </p>

          <div className="mt-6 rounded-2xl border border-white/15 bg-white/8 p-5 backdrop-blur-sm sm:p-6">
            <p className="text-xs font-semibold tracking-[0.16em] text-(--accent) uppercase">
              {t("servicesPage.seoNote.label")}
            </p>
            <p className="mt-2 text-left text-sm leading-7 text-white/85 sm:text-base">
              {t("servicesPage.seoNote.text")}
            </p>
          </div>
        </div>
      </header>

      <section className="mx-auto w-full max-w-6xl px-6 pb-16 sm:pb-20">
        {isLoading ? (
          <div
            className="no-scrollbar -mx-6 flex snap-x snap-mandatory scroll-px-6 items-start gap-6 overflow-x-auto scroll-smooth px-6 pb-2 lg:mx-0 lg:grid lg:grid-cols-2 lg:overflow-visible lg:px-0 lg:pb-0"
            data-reveal
          >
            {Array.from({ length: 2 }, (_, index) => (
              <div
                key={`service-skeleton-${index}`}
                className="w-[85%] shrink-0 snap-start sm:w-[60%] lg:w-auto lg:shrink"
              >
                <ServiceCardSkeleton />
              </div>
            ))}
          </div>
        ) : fetchError || cards.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-white/15 bg-white/3 p-8 text-center">
            <p className="text-base text-white/86">
              {fetchError ? t("servicesPage.fetchError") : t("servicesPage.emptyState")}
            </p>
          </div>
        ) : (
          <div
            className="no-scrollbar -mx-6 flex snap-x snap-mandatory scroll-px-6 items-start gap-6 overflow-x-auto scroll-smooth px-6 pb-2 lg:mx-0 lg:grid lg:grid-cols-2 lg:overflow-visible lg:px-0 lg:pb-0"
            data-reveal
          >
            {cards.map((card) => (
              <div
                key={card.id}
                className="w-[85%] shrink-0 snap-start sm:w-[60%] lg:w-auto lg:shrink"
              >
                <ServiceCard
                  serviceName={card.name}
                  description={card.description}
                  regularPrice={card.regularPrice}
                  discountedPrice={card.discountedPrice}
                  hasDiscount={card.hasDiscount}
                  discountLabel={t("servicesPage.discountBadge")}
                  expandLabel={t("servicesPage.expandDescription")}
                  collapseLabel={t("servicesPage.collapseDescription")}
                  slug={card.slug}
                  images={card.images}
                  contactBaseHref={contactHref}
                  ctaLabel={t("servicesPage.cardCta")}
                  ctaAriaLabel={t("servicesPage.cardCtaAria")}
                />
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 pb-16 sm:pb-20" data-reveal>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold tracking-[0.18em] text-(--color-secondary-warm) uppercase">
            {t("servicesPage.maintenance.label")}
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            {t("servicesPage.maintenance.title")}
          </h2>
          <p className="mt-4 text-left text-sm leading-7 text-white/78 sm:text-base">
            {t("servicesPage.maintenance.text")}
          </p>
        </div>

        <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {MAINTENANCE_ITEMS.map(({ key, Icon }) => (
            <li
              key={key}
              className="flex items-center gap-2.5 rounded-2xl border border-white/10 bg-white/4 px-4 py-3"
            >
              <Icon className="size-4 shrink-0 text-(--accent)" aria-hidden="true" />
              <span className="min-w-0 flex-1 text-xs font-medium break-words text-white/85 sm:text-sm">
                {t(`servicesPage.maintenance.items.${key}`)}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 border-t border-white/10 pt-6">
          <p className="text-base font-semibold text-emerald-300 sm:text-lg">
            {t("servicesPage.maintenance.priceLabel", { price: maintenanceStartingPrice })}
          </p>
          <a
            href={contactHref}
            className="inline-flex items-center text-sm font-semibold tracking-[0.08em] text-(--accent) uppercase transition-colors hover:text-(--primary)"
          >
            {t("servicesPage.maintenance.cta")}
          </a>
        </div>
      </section>
    </>
  );
}
