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
  price: string;
  images: string[];
  order: number;
};

const API_BASE_URL = "https://synelweb.fly.dev";
const SERVICES_ENDPOINT = `${API_BASE_URL}/api/services/`;

function pickLocalized(text: LocalizedText | undefined, lang: AppLang): string {
  if (!text) return "";
  const candidate = text[lang] ?? text.hu ?? text.en ?? text.de ?? "";
  return candidate.trim();
}

function formatPrice(price: ApiPrice | null | undefined): string {
  if (!price || typeof price.amount !== "number") return "";
  const currency = (price.currency || "HUF").trim() || "HUF";
  return `${new Intl.NumberFormat("hu-HU").format(price.amount)} ${currency}`;
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
      const normalPrice = formatPrice(item.salePrice ?? item.price);
      return {
        id: String(item.id),
        name: pickLocalized(item.title, lang),
        slug: pickLocalized(item.slug, lang),
        description: pickLocalized(item.description, lang),
        price: normalPrice,
        images: Array.isArray(item.images) ? item.images.filter(Boolean) : [],
        order: typeof item.order === "number" ? item.order : Number(item.id) || 0,
      };
    })
    .sort((a, b) => a.order - b.order);
}
