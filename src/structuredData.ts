import { BRAND_NAME, SITE_URL } from "@/components/site";
import type { SupportedLang } from "@/src/i18n-config";
import {
  BLOG_POST_LANG,
  KNOWN_LOGICAL_PATHS,
  type KnownLogicalPath,
  type RegionalLogicalPath,
} from "@/src/localizedRoutes";

const OWNER_NAME = "Németh Szilveszter";
const BUSINESS_EMAIL = "info@synelweb.hu";
const BUSINESS_PHONE = "+36303645516";
const SOCIAL_LINKS = [
  "https://www.facebook.com/profile.php?id=61586963195763",
  "https://www.linkedin.com/in/szilveszter-nemeth-636689332/",
];

export const BREADCRUMB_LABELS: Record<SupportedLang, Record<KnownLogicalPath, string>> = {
  en: {
    "/": "Home",
    "/about": "About",
    "/services": "Services",
    "/google-ads": "Google Ads management",
    "/site-check": "Website check",
    "/projects": "Projects",
    "/certificates": "Certificates",
    "/blog": "Blog",
    "/technology": "Technology",
    "/contact": "Contact",
  },
  hu: {
    "/": "Főoldal",
    "/about": "Rólam",
    "/services": "Szolgáltatások",
    "/google-ads": "Google Ads kezelés",
    "/site-check": "Weboldal-ellenőrzés",
    "/projects": "Projektek",
    "/certificates": "Tanúsítványok",
    "/blog": "Blog",
    "/technology": "Technológia",
    "/contact": "Kapcsolat",
  },
  de: {
    "/": "Startseite",
    "/about": "Über mich",
    "/services": "Leistungen",
    "/google-ads": "Google Ads Betreuung",
    "/site-check": "Website-Check",
    "/projects": "Projekte",
    "/certificates": "Zertifikate",
    "/blog": "Blog",
    "/technology": "Technologie",
    "/contact": "Kontakt",
  },
};

export const REGIONAL_BREADCRUMB_LABELS: Record<RegionalLogicalPath, string> = {
  "/sopron": "Weboldal készítés Sopron",
  "/austria": "Webdesign Burgenland & Wien",
};

export function isKnownLogicalPath(path: string): path is KnownLogicalPath {
  return (KNOWN_LOGICAL_PATHS as readonly string[]).includes(path);
}

export function buildOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["ProfessionalService", "Organization"],
    "@id": `${SITE_URL}/#organization`,
    name: BRAND_NAME,
    alternateName: OWNER_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/sw-favicon.svg`,
    image: `${SITE_URL}/og-image.png`,
    email: BUSINESS_EMAIL,
    telephone: BUSINESS_PHONE,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Hajnal tér 14.",
      addressLocality: "Sopron",
      postalCode: "9400",
      addressCountry: "HU",
    },
    areaServed: ["HU", "AT", "US"],
    founder: {
      "@type": "Person",
      name: OWNER_NAME,
    },
    sameAs: SOCIAL_LINKS,
  };
}

export function buildWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: BRAND_NAME,
    url: SITE_URL,
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

export type BreadcrumbItem = { name: string; url: string };

export function buildBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

type BlogPostingInput = {
  url: string;
  title: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified?: string;
  // The author's own page (the About page).
  authorUrl?: string;
};

export function buildBlogPostingJsonLd({
  url,
  title,
  description,
  image,
  datePublished,
  dateModified,
  authorUrl,
}: BlogPostingInput) {
  const isDate = (value?: string) => Boolean(value) && !Number.isNaN(Date.parse(value as string));
  const hasValidDate = isDate(datePublished);

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    headline: title,
    description,
    inLanguage: BLOG_POST_LANG,
    ...(image ? { image } : {}),
    ...(hasValidDate ? { datePublished } : {}),
    ...(isDate(dateModified) ? { dateModified } : {}),
    // A named person, not the brand: who wrote it is what readers and search
    // engines look for.
    author: { "@type": "Person", name: OWNER_NAME, url: authorUrl ?? SITE_URL },
    publisher: {
      "@type": "Organization",
      name: BRAND_NAME,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/sw-favicon.svg` },
    },
  };
}

type RegionalServiceInput = {
  url: string;
  name: string;
  description: string;
  areasServed: string[];
};

// A regional landing page describes the same business serving one area.
export function buildRegionalServiceJsonLd({
  url,
  name,
  description,
  areasServed,
}: RegionalServiceInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    name,
    description,
    url,
    serviceType: "Web design and development",
    provider: { "@id": `${SITE_URL}/#organization` },
    areaServed: areasServed.map((place) => ({ "@type": "Place", name: place })),
  };
}

const ORGANIZATION_REF = { "@id": `${SITE_URL}/#organization` };

// The questions a page answers. Empty input gives null: no block at all.
export function buildFaqJsonLd(items: Array<{ q: string; a: string }>) {
  const questions = items.filter((item) => item.q.trim() && item.a.trim());
  if (questions.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}

export type ServiceOffer = {
  name: string;
  description?: string;
  url?: string;
  // The lowest price the service is sold for (the sale price when on sale).
  price?: number;
  currency?: string;
};

// The services a page lists, with their starting prices.
export function buildServiceCatalogJsonLd({
  url,
  name,
  services,
}: {
  url: string;
  name: string;
  services: ServiceOffer[];
}) {
  const listed = services.filter((service) => service.name.trim());
  if (listed.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    "@id": `${url}#services`,
    name,
    url,
    itemListElement: listed.map((service) => ({
      "@type": "Offer",
      ...(typeof service.price === "number"
        ? { price: service.price, priceCurrency: service.currency ?? "HUF" }
        : {}),
      itemOffered: {
        "@type": "Service",
        name: service.name,
        ...(service.description ? { description: service.description } : {}),
        ...(service.url ? { url: service.url } : {}),
        provider: ORGANIZATION_REF,
      },
    })),
  };
}

// One service with its own page (Google Ads management).
export function buildServiceJsonLd({
  url,
  name,
  description,
  serviceType,
  offers,
}: {
  url: string;
  name: string;
  description: string;
  serviceType: string;
  offers: Array<{ name: string; price: number; currency: string }>;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    name,
    description,
    url,
    serviceType,
    provider: ORGANIZATION_REF,
    areaServed: ["HU", "AT"],
    offers: offers.map((offer) => ({
      "@type": "Offer",
      name: offer.name,
      price: offer.price,
      priceCurrency: offer.currency,
    })),
  };
}

// The free website checker: a web app anyone can use at no cost.
export function buildWebApplicationJsonLd({
  url,
  name,
  description,
  lang,
}: {
  url: string;
  name: string;
  description: string;
  lang: SupportedLang;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "@id": `${url}#app`,
    name,
    description,
    url,
    inLanguage: lang,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Any",
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: 0, priceCurrency: "HUF" },
    provider: ORGANIZATION_REF,
  };
}
