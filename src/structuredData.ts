import { BRAND_NAME, SITE_URL } from "@/components/site";
import type { SupportedLang } from "@/src/i18n-config";
import { KNOWN_LOGICAL_PATHS, type KnownLogicalPath } from "@/src/localizedRoutes";

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
    "/projects": "Projects",
    "/blog": "Blog",
    "/technology": "Technology",
    "/contact": "Contact",
  },
  hu: {
    "/": "Főoldal",
    "/about": "Rólam",
    "/services": "Szolgáltatások",
    "/projects": "Projektek",
    "/blog": "Blog",
    "/technology": "Technológia",
    "/contact": "Kapcsolat",
  },
  de: {
    "/": "Startseite",
    "/about": "Über mich",
    "/services": "Leistungen",
    "/projects": "Projekte",
    "/blog": "Blog",
    "/technology": "Technologie",
    "/contact": "Kontakt",
  },
};

export function isKnownLogicalPath(path: string): path is KnownLogicalPath {
  return (KNOWN_LOGICAL_PATHS as readonly string[]).includes(path);
}

export function buildOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
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
    areaServed: "HU",
    founder: {
      "@type": "Person",
      name: OWNER_NAME,
    },
    sameAs: SOCIAL_LINKS,
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
};

export function buildBlogPostingJsonLd({
  url,
  title,
  description,
  image,
  datePublished,
}: BlogPostingInput) {
  const hasValidDate = Boolean(datePublished) && !Number.isNaN(Date.parse(datePublished));

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    headline: title,
    description,
    ...(image ? { image } : {}),
    ...(hasValidDate ? { datePublished } : {}),
    author: { "@type": "Organization", name: BRAND_NAME, url: SITE_URL },
    publisher: {
      "@type": "Organization",
      name: BRAND_NAME,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/sw-favicon.svg` },
    },
  };
}
