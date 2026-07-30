import { resolveApiBaseUrl } from "@/src/apiBaseUrl";

export type AppLang = "hu" | "en" | "de";

type LocalizedText = {
  hu?: string;
  en?: string;
  de?: string;
};

type ApiPrice = {
  amount?: number;
  currency?: string;
};

type ApiServiceCard = {
  id: string | number;
  slug?: LocalizedText;
  title?: LocalizedText;
  description?: LocalizedText;
  images?: string[];
  price?: ApiPrice;
  salePrice?: ApiPrice | null;
  isActive?: boolean;
  order?: number;
};

export type ServiceCard = {
  id: string;
  name: string;
  slug: string;
  description: string;
  regularPrice: string;
  discountedPrice: string;
  hasDiscount: boolean;
  images: string[];
  order: number;
};

const SERVICES_ENDPOINT = `${resolveApiBaseUrl()}/api/services/`;

const LOCALE_BY_LANG: Record<AppLang, string> = {
  hu: "hu-HU",
  en: "en-US",
  de: "de-DE",
};

function pickLocalized(text: LocalizedText | undefined, lang: AppLang): string {
  if (!text) return "";
  const candidate = text[lang] ?? text.hu ?? text.en ?? text.de ?? "";
  return candidate.trim();
}

function formatPrice(price: ApiPrice | null | undefined, lang: AppLang): string {
  if (!price || typeof price.amount !== "number") return "";
  const currency = (price.currency || "HUF").trim() || "HUF";
  const locale = LOCALE_BY_LANG[lang] ?? LOCALE_BY_LANG.hu;
  return new Intl.NumberFormat(locale, { style: "currency", currency }).format(price.amount);
}

export async function getServiceCards(lang: AppLang): Promise<ServiceCard[]> {
  const response = await fetch(SERVICES_ENDPOINT, {
    headers: {
      "Accept-Language": lang,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch services.");
  }

  const data = (await response.json()) as ApiServiceCard[];

  return data
    .filter((item) => item.isActive !== false)
    .map((item) => {
      const regularPrice = formatPrice(item.price, lang);
      const discountedPrice = formatPrice(item.salePrice, lang);
      const hasDiscount = discountedPrice.length > 0;
      return {
        id: String(item.id),
        name: pickLocalized(item.title, lang),
        slug: pickLocalized(item.slug, lang),
        description: pickLocalized(item.description, lang),
        regularPrice,
        discountedPrice,
        hasDiscount,
        images: Array.isArray(item.images) ? item.images.filter(Boolean) : [],
        order: typeof item.order === "number" ? item.order : Number(item.id) || 0,
      };
    })
    .sort((a, b) => a.order - b.order);
}
