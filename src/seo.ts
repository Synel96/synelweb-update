import { BRAND_NAME, SITE_URL } from "../components/site";
import { SUPPORTED_LANGS, DEFAULT_LANG, type SupportedLang } from "./i18n-config";
import {
  BLOG_POST_LANG,
  isBlogPostLogicalPath,
  isLegalLogicalPath,
  isRegionalLogicalPath,
  localizePath,
  normalizeLogicalPath,
  REGIONAL_PAGES,
  type KnownLogicalPath,
  type RegionalLogicalPath,
} from "./localizedRoutes";

type SeoEntry = {
  title: string;
  description: string;
};

// Pages with their own 1200x630 share image, one per language, in
// public/og/<name>-<lang>.jpg (the regional pages exist in their one
// language only). Blog posts use their own picture; the rest (legal pages)
// share the brand image, public/og-image.png.
const OG_IMAGE_PAGES: Partial<Record<string, string>> = {
  "/": "home",
  "/about": "about",
  "/services": "services",
  "/google-ads": "google-ads",
  "/site-check": "site-check",
  "/projects": "projects",
  "/certificates": "certificates",
  "/blog": "blog",
  "/technology": "technology",
  "/contact": "contact",
  "/sopron": "sopron",
  "/austria": "austria",
};

type BuildMetaInput = {
  /** Logical pathname without lang prefix, e.g. "/" or "/about" */
  pathname: string;
  lang: SupportedLang;
  title?: string | null;
  description?: string | null;
  image?: string | null;
  // Blog posts only: the languages the post is translated into.
  postLangs?: readonly SupportedLang[] | null;
};

export const PAGE_SEO: Record<SupportedLang, Record<KnownLogicalPath, SeoEntry>> = {
  en: {
    "/": {
      title: "Website Design in Hungary & Europe | SynelWeb Web Development",
      description:
        "Custom, lightning-fast websites for clients across Hungary and Europe, delivered online. Premium design and future-ready architecture from SynelWeb.",
    },
    "/about": {
      title: "About – Web Developer from Sopron, Hungary | SynelWeb",
      description:
        "Meet Szilveszter Németh, the web developer behind SynelWeb in Sopron: custom websites, technical SEO and fast, secure solutions for small businesses.",
    },
    "/services": {
      title: "Website Design Services & Pricing | SynelWeb",
      description:
        "Website design services and prices: landing pages, business websites, online shops and Google Ads management – custom-built, fast and SEO-ready.",
    },
    "/google-ads": {
      title: "Google Ads Management for Small Businesses | SynelWeb",
      description:
        "Google Search ads set up and managed by a Google Ads Search certified developer: keyword research, conversion tracking, monthly reports and transparent pricing.",
    },
    "/site-check": {
      title: "Free Website Check: Speed, SEO & Tech | SynelWeb",
      description:
        "Free website check: Lighthouse scores, SEO basics, technical details and the platform a site is built with, on mobile and desktop, with a PDF report.",
    },
    "/projects": {
      title: "Website Portfolio & Projects | SynelWeb",
      description:
        "Website portfolio: real client projects with their Lighthouse scores – fast, modern, mobile-friendly sites built with custom code, not templates.",
    },
    "/certificates": {
      title: "Web Development & Google Ads Certificates | SynelWeb",
      description:
        "Verifiable certificates in frontend, backend and full-stack web development and Google Search Ads – the knowledge behind every SynelWeb project.",
    },
    "/blog": {
      title: "Web Development & SEO Blog | SynelWeb",
      description:
        "Practical articles on web development, SEO and website costs for small businesses – what makes a site fast, findable and worth the money.",
    },
    "/technology": {
      title: "Technology: React, Django, PostgreSQL | SynelWeb",
      description:
        "The technology behind every SynelWeb site: React, TypeScript, Django and PostgreSQL for fast, secure websites that are easy to extend later.",
    },
    "/contact": {
      title: "Contact & Request a Quote | SynelWeb",
      description:
        "Contact SynelWeb by email, phone or video call from anywhere in Hungary or Austria, and request a free quote for your website in a few minutes.",
    },
  },
  hu: {
    "/": {
      title: "Weboldal Készítés Országosan | SynelWeb Webfejlesztés",
      description:
        "Egyedi, villámgyors weboldal készítés bárhol Magyarországon, online egyeztetéssel. Lassú sablonok helyett prémium dizájn és jövőálló technika.",
    },
    "/about": {
      title: "Rólam – webfejlesztő Sopronból | SynelWeb",
      description:
        "Németh Szilveszter vagyok, soproni webfejlesztő: egyedi weboldalakat, technikai SEO-t és gyors, biztonságos megoldásokat készítek vállalkozásoknak.",
    },
    "/services": {
      title: "Weblap árak és szolgáltatások | SynelWeb",
      description:
        "Weboldal készítés árak: landing oldal, céges weboldal, webshop és Google Ads kezelés – egyedi kóddal, gyorsan, keresőoptimalizálással az alapárban.",
    },
    "/google-ads": {
      title: "Google Ads kezelés kisvállalkozásoknak | SynelWeb",
      description:
        "Google keresőhirdetés beállítása és kezelése Google Ads Search tanúsítvánnyal: kulcsszókutatás, konverziómérés és havi riport – Sopronból, országosan.",
    },
    "/site-check": {
      title: "Weboldal-ellenőrzés: sebesség, SEO, technika | SynelWeb",
      description:
        "Ingyenes weboldal-ellenőrzés: Lighthouse-pontszámok, SEO-alapok, technikai részletek és az oldal platformja mobilon és asztalin, PDF riporttal.",
    },
    "/projects": {
      title: "Weboldal referenciák és projektek | SynelWeb",
      description:
        "Weboldal referenciák mért Lighthouse-pontszámokkal: gyors, mobilbarát, egyedi kóddal készült oldalak valódi ügyfeleknek, sablonok nélkül.",
    },
    "/certificates": {
      title: "Webfejlesztő és Google Ads tanúsítványok | SynelWeb",
      description:
        "Ellenőrizhető tanúsítványok frontend, backend és fullstack webfejlesztésből és Google keresőhirdetésből – a tudás minden SynelWeb-projekt mögött.",
    },
    "/blog": {
      title: "Webfejlesztés és SEO blog | SynelWeb",
      description:
        "Gyakorlati cikkek webfejlesztésről, SEO-ról és weboldal árakról kisvállalkozásoknak: mitől lesz egy oldal gyors, megtalálható és megtérülő.",
    },
    "/technology": {
      title: "Technológia: React, Django, PostgreSQL | SynelWeb",
      description:
        "Modern technológiai háttér TypeScripttel, Pythonnal, Djangóval és PostgreSQL-lel: gyors, biztonságos és jövőálló webes rendszerek.",
    },
    "/contact": {
      title: "Kapcsolat és ajánlatkérés | SynelWeb",
      description:
        "Lépj kapcsolatba a SynelWebbel e-mailben, telefonon vagy online egyeztetéssel – bárhonnan Magyarországról, Sopronban személyesen is.",
    },
  },
  de: {
    "/": {
      title: "Webdesign in Ungarn & Österreich | SynelWeb Webagentur",
      description:
        "Individuelles, blitzschnelles Webdesign und Homepage erstellen lassen – für Ungarn und Österreich, auch im Burgenland. Premium-Design von SynelWeb.",
    },
    "/about": {
      title: "Über mich – Webentwickler aus Sopron | SynelWeb",
      description:
        "Ich bin Szilveszter Németh, Webentwickler aus Sopron: individuelle Websites, technisches SEO und schnelle, sichere Lösungen für Unternehmen.",
    },
    "/services": {
      title: "Webdesign Preise & Leistungen | SynelWeb",
      description:
        "Webdesign Preise: Landingpage, Firmenwebsite, Onlineshop und Google-Ads-Betreuung – individuell programmiert, schnell und mit SEO im Grundpreis.",
    },
    "/google-ads": {
      title: "Google Ads Betreuung für kleine Unternehmen | SynelWeb",
      description:
        "Google-Suchanzeigen einrichten und betreuen lassen, mit Google-Ads-Search-Zertifizierung: Keyword-Recherche, Conversion-Tracking, monatliche Berichte.",
    },
    "/site-check": {
      title: "Kostenloser Website-Check: Speed, SEO, Technik | SynelWeb",
      description:
        "Kostenloser Website-Check: Lighthouse-Werte, SEO-Grundlagen, technische Details und die Plattform der Seite, mobil und am Desktop, mit PDF-Bericht.",
    },
    "/projects": {
      title: "Webdesign Referenzen & Projekte | SynelWeb",
      description:
        "Webdesign Referenzen mit gemessenen Lighthouse-Werten: schnelle, mobilfreundliche Websites für echte Kunden, individuell programmiert statt Vorlagen.",
    },
    "/certificates": {
      title: "Zertifikate: Webentwicklung & Google Ads | SynelWeb",
      description:
        "Überprüfbare Zertifikate in Frontend-, Backend- und Full-Stack-Webentwicklung sowie Google-Suchanzeigen – das Wissen hinter jedem SynelWeb-Projekt.",
    },
    "/blog": {
      title: "Blog zu Webentwicklung & SEO | SynelWeb",
      description:
        "Praxisnahe Artikel zu Webentwicklung, SEO und Website-Kosten für kleine Unternehmen: was eine Seite schnell, auffindbar und rentabel macht.",
    },
    "/technology": {
      title: "Technologie: React, Django, PostgreSQL | SynelWeb",
      description:
        "Die Technik hinter jeder SynelWeb-Seite: React, TypeScript, Django und PostgreSQL für schnelle, sichere Websites, die sich später leicht erweitern lassen.",
    },
    "/contact": {
      title: "Kontakt & Angebot anfordern | SynelWeb",
      description:
        "Kontaktiere SynelWeb per E-Mail, Telefon oder online – aus Österreich, Ungarn oder von überall, mit persönlichen Terminen im Burgenland und in Wien.",
    },
  },
};

// Regional landing pages: one language each (see REGIONAL_PAGES).
export const REGIONAL_SEO: Record<RegionalLogicalPath, SeoEntry> = {
  "/sopron": {
    title: "Weboldal és honlap készítés Sopronban | SynelWeb",
    description:
      "Egyedi, villámgyors weboldal- és honlapkészítés Sopronban és környékén, személyes egyeztetéssel: magyar–német oldalak, helyi SEO és Google Cégprofil.",
  },
  "/austria": {
    title: "Webdesign Burgenland & Wien | SynelWeb",
    description:
      "Individuelles, blitzschnelles Webdesign für Unternehmen im Burgenland und in Wien: DSGVO-konform, mit Preisen in Euro und persönlichen Terminen.",
  },
};

export function getSeoEntry(pathname: string, lang: SupportedLang): SeoEntry {
  const normalized = normalizeLogicalPath(pathname);
  if (isRegionalLogicalPath(normalized) && REGIONAL_PAGES[normalized].lang === lang) {
    return REGIONAL_SEO[normalized];
  }
  const logicalPath = normalizeLogicalPath(pathname) as KnownLogicalPath;
  return PAGE_SEO[lang][logicalPath] ?? { title: BRAND_NAME, description: "" };
}

export function buildMeta({
  pathname,
  lang,
  title,
  description,
  image,
  postLangs,
}: BuildMetaInput) {
  const logicalPath = normalizeLogicalPath(pathname) as KnownLogicalPath;
  const fallbackMeta = getSeoEntry(logicalPath, lang);
  const resolvedTitle = title && title.trim().length > 0 ? title : fallbackMeta.title;
  const resolvedDescription =
    description && description.trim().length > 0 ? description : fallbackMeta.description;
  // A page with its own share image (see OG_IMAGE_PAGES) uses it; the rest
  // share the brand image.
  const ownImage = OG_IMAGE_PAGES[logicalPath]
    ? `${SITE_URL}/og/${OG_IMAGE_PAGES[logicalPath]}-${lang}.jpg`
    : `${SITE_URL}/og-image.png`;
  const resolvedImage = image && image.trim().length > 0 ? image : ownImage;
  const urlFor = (path: string) => new URL(path, SITE_URL).toString();

  // Single-language pages name only themselves; a page shown in the wrong
  // language points at the original instead of competing with it:
  // - legal pages are Hungarian and unprefixed (/impresszum),
  // - a blog post lists the languages it is translated into; in any other
  //   language it shows the Hungarian text and is canonical to that,
  // - a regional page has no translations.
  let canonicalUrl: string;
  let alternates: Array<{ hreflang: string; href: string }>;
  if (isLegalLogicalPath(logicalPath)) {
    canonicalUrl = urlFor(logicalPath);
    alternates = [{ hreflang: DEFAULT_LANG, href: canonicalUrl }];
  } else if (isBlogPostLogicalPath(logicalPath)) {
    const langs = SUPPORTED_LANGS.filter((l) => l === BLOG_POST_LANG || postLangs?.includes(l));
    const pageLang = langs.includes(lang) ? lang : BLOG_POST_LANG;
    canonicalUrl = urlFor(localizePath(logicalPath, pageLang));
    alternates = langs.map((l) => ({ hreflang: l, href: urlFor(localizePath(logicalPath, l)) }));
    if (langs.length > 1) {
      alternates.push({
        hreflang: "x-default",
        href: urlFor(localizePath(logicalPath, BLOG_POST_LANG)),
      });
    }
  } else if (isRegionalLogicalPath(logicalPath)) {
    canonicalUrl = urlFor(localizePath(logicalPath, lang));
    alternates = [{ hreflang: lang, href: canonicalUrl }];
  } else {
    canonicalUrl = urlFor(localizePath(logicalPath, lang));
    alternates = [
      ...SUPPORTED_LANGS.map((l) => ({ hreflang: l, href: urlFor(localizePath(logicalPath, l)) })),
      { hreflang: "x-default", href: urlFor(localizePath(logicalPath, DEFAULT_LANG)) },
    ];
  }

  return {
    canonicalUrl,
    title: resolvedTitle,
    description: resolvedDescription,
    image: resolvedImage,
    alternates,
  };
}

// Search results cut a description at roughly this many characters.
const META_DESCRIPTION_MAX = 155;

// A description that fits a search result: cut at a word boundary, never
// mid-word, and marked with an ellipsis when something was left off.
export function toMetaDescription(text: string): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= META_DESCRIPTION_MAX) return clean;
  const cut = clean.slice(0, META_DESCRIPTION_MAX - 1);
  const lastSpace = cut.lastIndexOf(" ");
  const base = lastSpace > META_DESCRIPTION_MAX / 2 ? cut.slice(0, lastSpace) : cut;
  return `${base.replace(/[\s,;:–-]+$/, "")}…`;
}

// Longer than this and the brand would be cut off in a search result anyway.
const TITLE_WITH_BRAND_MAX = 65;

// "Post title | SynelWeb" when it fits, the bare title when it doesn't.
export function toPostTitle(title: string): string {
  const withBrand = `${title} | ${BRAND_NAME}`;
  return withBrand.length <= TITLE_WITH_BRAND_MAX ? withBrand : title;
}
