import { useEffect, useState } from "react";
import { usePageContext } from "vike-react/usePageContext";
import { useTranslation } from "react-i18next";
import { ServiceCard } from "@/components/ServiceCard";
import { DEFAULT_LANG, type SupportedLang } from "@/src/i18n-config";
import {
  getServiceCards,
  type ServiceCard as ServiceCardItem,
  type AppLang,
} from "@/src/services/serviceCardsService";

export default function Page() {
  const pageContext = usePageContext() as { lang?: SupportedLang };
  const lang = (pageContext.lang ?? DEFAULT_LANG) as AppLang;
  const { t } = useTranslation();
  const contactHref = `/${lang}/contact`;
  const [cards, setCards] = useState<ServiceCardItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setIsLoading(true);
      setFetchError(false);
      try {
        const items = await getServiceCards(lang);
        if (mounted) setCards(items);
      } catch {
        if (mounted) {
          setCards([]);
          setFetchError(true);
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    void load();
    return () => {
      mounted = false;
    };
  }, [lang]);

  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-16 sm:py-20">
      <header className="mb-10" data-reveal>
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

      {isLoading ? (
        <p className="text-sm text-white/75">{t("servicesPage.loading")}</p>
      ) : fetchError || cards.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-white/15 bg-white/3 p-8 text-center">
          <p className="text-base text-white/86">
            {fetchError ? t("servicesPage.fetchError") : t("servicesPage.emptyState")}
          </p>
        </div>
      ) : (
        <div className="grid items-start gap-6 lg:grid-cols-2" data-reveal>
          {cards.map((card) => (
            <ServiceCard
              key={card.id}
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
          ))}
        </div>
      )}
    </section>
  );
}
