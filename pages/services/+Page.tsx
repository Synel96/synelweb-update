import { useEffect, useState } from "react";
import { usePageContext } from "vike-react/usePageContext";
import { useTranslation } from "react-i18next";
import { ServiceCard } from "@/components/ServiceCard";
import { ServiceCardSkeleton } from "@/components/ServiceCardSkeleton";
import { withCloudinaryAutoParams } from "@/src/cloudinary";
import { resolveCurrentLang } from "@/src/localizedRoutes";
import {
  getServiceCards,
  type AppLang,
  type ServiceCard as ServiceCardItem,
} from "@/src/services/serviceCardsService";

const SERVICES_HERO_BACKGROUND_URL = withCloudinaryAutoParams(
  "https://res.cloudinary.com/dmwulp3dl/image/upload/v1785435017/file_00000000ab7c81f4a2ae6d50ec63ad13_lakyk6.png"
);

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

  const [cards, setCards] = useState<ServiceCardItem[]>(initialCards);
  const [fetchError, setFetchError] = useState(initialFetchError);
  const [isLoading, setIsLoading] = useState(initialCards.length === 0 && !initialFetchError);

  useEffect(() => {
    setCards(initialCards);
    setFetchError(initialFetchError);
    setIsLoading(initialCards.length === 0 && !initialFetchError);
  }, [initialCards, initialFetchError]);

  useEffect(() => {
    let isMounted = true;

    async function refreshCards() {
      setIsLoading(true);
      setFetchError(false);

      try {
        const latestCards = await getServiceCards(toAppLang(routeLang));
        if (!isMounted) return;

        setCards(latestCards);
        setFetchError(false);
      } catch {
        if (!isMounted) return;
        setFetchError(true);
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
      <div className="fixed inset-0 -z-10" aria-hidden="true">
        <img
          src={SERVICES_HERO_BACKGROUND_URL}
          alt=""
          className="h-full w-full object-cover object-[center_70%]"
          loading="eager"
        />
        <div className="absolute inset-0 bg-[rgba(11,15,25,0.35)]" />
      </div>

      <header className="mx-auto w-full max-w-6xl px-6 pt-36 pb-16 sm:pt-40 sm:pb-14" data-reveal>
        <p className="text-xs font-semibold tracking-[0.18em] text-(--accent) uppercase">
          {t("homeFlow.services.label")}
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          {t("homeFlow.services.title")}
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-white/80 sm:text-lg">
          {t("homeFlow.services.text")}
        </p>
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
                  imageAlt={(index) => t("servicesPage.imageAlt", { service: card.name, index })}
                  contactBaseHref={contactHref}
                  ctaLabel={t("servicesPage.cardCta")}
                  ctaAriaLabel={t("servicesPage.cardCtaAria")}
                />
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
