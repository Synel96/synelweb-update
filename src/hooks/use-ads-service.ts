import { useTranslation } from "react-i18next";
import { useHufFormatter } from "@/src/currency";
import { ADS_SETUP_PRICE_HUF } from "@/src/pricing";
import type { AppLang, ServiceCard } from "@/src/services/serviceCardsService";

export const ADS_SERVICE_SLUG = "google-ads";

// The Google Search ads service as a service card, priced in code (see
// ADS_SETUP_PRICE_HUF) and converted for the English/German pages.
export function useAdsServiceCard(lang: AppLang): ServiceCard {
  const { t } = useTranslation();
  const formatHuf = useHufFormatter(lang);
  return {
    id: ADS_SERVICE_SLUG,
    category: "marketing",
    name: t("adsPage.service.name"),
    slug: ADS_SERVICE_SLUG,
    description: t("adsPage.service.description"),
    regularPrice: formatHuf(ADS_SETUP_PRICE_HUF),
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
