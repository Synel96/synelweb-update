import { useTranslation } from "react-i18next";
import type { AppLang, ServiceCard } from "@/src/services/serviceCardsService";

export const ADS_SERVICE_SLUG = "google-ads";

// The Google Search ads service as a service card. It has no fixed price:
// setup and monthly management are both quoted per campaign.
export function useAdsServiceCard(lang: AppLang): ServiceCard {
  const { t } = useTranslation();
  return {
    id: ADS_SERVICE_SLUG,
    category: "marketing",
    name: t("adsPage.service.name"),
    slug: ADS_SERVICE_SLUG,
    description: t("adsPage.service.description"),
    regularPrice: t("adsPage.service.price"),
    discountedPrice: "",
    hasDiscount: false,
    monthlyPrice: "",
    images: [],
    order: Number.MAX_SAFE_INTEGER,
  };
}

// The backend's services plus the ads service; an ads service someone also
// added in the admin is dropped so it doesn't show twice.
export function withAdsService(cards: ServiceCard[], adsCard: ServiceCard): ServiceCard[] {
  return [
    ...cards.filter((card) => !(card.category === "marketing" && /google/i.test(card.name))),
    adsCard,
  ];
}
