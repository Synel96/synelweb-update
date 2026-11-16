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

type BuildMetaInput = {
  /** Logical pathname without lang prefix, e.g. "/" or "/about" */
  pathname: string;
  lang: SupportedLang;
  title?: string | null;
  description?: string | null;
  image?: string | null;
};

export const PAGE_SEO: Record<SupportedLang, Record<KnownLogicalPath, SeoEntry>> = {
  en: {
    "/": {
      title: "Website Design in Hungary & Europe | SynelWeb Web Development",
      description:
        "Custom, lightning-fast website design, delivered online for clients across Hungary, Europe, and beyond. Forget slow templates! Premium design and future-ready architecture from SynelWeb.",
    },
    "/about": {
      title: "About – Web Developer from Sopron, Hungary | SynelWeb",
      description:
        "Learn how I work: custom web development, technical SEO, and fast, secure solutions for businesses.",
    },
    "/services": {
      title: "Website Design Services & Pricing | SynelWeb",
      description:
        "Services and development approach in one place: custom, fast, and business-ready web solutions.",
    },
    "/google-ads": {
      title: "Google Ads Management for Small Businesses | SynelWeb",
      description:
        "Google Search ads set up and managed by a Google Ads Search certified developer: keyword research, conversion tracking, monthly reports and transparent pricing.",
    },
    "/site-check": {
      title: "Free Website Check – Speed, SEO & Accessibility | SynelWeb",
      description:
        "Check your website for free: Google Lighthouse scores for performance, accessibility, best practices and SEO, Core Web Vitals and the biggest improvements – on mobile and desktop.",
    },
    "/projects": {
      title: "Website Portfolio & Projects | SynelWeb",
      description:
        "Real projects and real technical quality: fast, modern, business-ready web solutions.",
    },
    "/certificates": {
      title: "Web Development & Google Ads Certificates | SynelWeb",
      description:
        "Verifiable certificates in frontend, backend and full-stack web development and Google Search Ads – the knowledge behind every SynelWeb project.",
    },
    "/blog": {
      title: "Web Development & SEO Blog | SynelWeb",
      description:
        "Insights, practical web development notes, and business-focused articles from SynelWeb.",
    },
    "/technology": {
      title: "Technology: React, Django, PostgreSQL | SynelWeb",
      description:
        "Modern technology stack with TypeScript, Python, Django, and PostgreSQL for fast, secure, future-ready systems.",
    },
    "/contact": {
      title: "Contact & Request a Quote | SynelWeb",
      description:
        "Contact SynelWeb by email, phone, or online — wherever in Hungary you are, with in-person meetings around Sopron.",
    },
  },
  hu: {
    "/": {
      title: "Weboldal Készítés Országosan | SynelWeb Webfejlesztés",
      description:
        "Egyedi, villámgyors weboldal készítés bárhol Magyarországon, online egyeztetéssel. Felejtsd el a lassú sablonokat! Prémium dizájn és jövőálló architektúra a SynelWebtől.",
    },
    "/about": {
      title: "Rólam – webfejlesztő Sopronból | SynelWeb",
      description:
        "Ismerd meg, hogyan dolgozom: egyedi webfejlesztés, technikai SEO, gyors és biztonságos megoldások helyi vállalkozásoknak.",
    },
    "/services": {
      title: "Weblap árak és szolgáltatások | SynelWeb",
      description:
        "Átlátható weblap árak és szolgáltatások egy helyen: egyedi, gyors és üzletileg használható webes megoldások.",
    },
    "/google-ads": {
      title: "Google Ads kezelés kisvállalkozásoknak | SynelWeb",
      description:
        "Google keresőhirdetés beállítás és kezelés Google Ads Search tanúsítvánnyal: kulcsszókutatás, konverziómérés, havi riport és átlátható árak – Sopronból, országosan.",
    },
    "/site-check": {
      title: "Ingyenes weboldal-ellenőrzés: sebesség és SEO | SynelWeb",
      description:
        "Mérd le ingyen a weboldalad: Google Lighthouse pontszámok teljesítményre, akadálymentességre, bevált gyakorlatokra és SEO-ra, Core Web Vitals és a legnagyobb javítási lehetőségek mobilon és asztalin.",
    },
    "/projects": {
      title: "Weboldal referenciák és projektek | SynelWeb",
      description:
        "Valós projektek, valós technikai minőség: gyors, modern és üzletileg használható webes megoldások.",
    },
    "/certificates": {
      title: "Webfejlesztő és Google Ads tanúsítványok | SynelWeb",
      description:
        "Ellenőrizhető tanúsítványok frontend, backend és fullstack webfejlesztésből, valamint Google keresőhirdetésből – a tudás, ami minden SynelWeb-projekt mögött áll.",
    },
    "/blog": {
      title: "Webfejlesztés és SEO blog | SynelWeb",
      description:
        "Szakmai cikkek, gyakorlati webfejlesztési tapasztalatok és üzleti szemléletű bejegyzések a SynelWebtől.",
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
        "Individuelles, blitzschnelles Webdesign und Homepage erstellen lassen – online verfügbar in ganz Ungarn, Österreich (auch Burgenland) und darüber hinaus. Vergiss langsame Vorlagen! Premium-Design von SynelWeb.",
    },
    "/about": {
      title: "Über mich – Webentwickler aus Sopron | SynelWeb",
      description:
        "Erfahre, wie ich arbeite: individuelle Webentwicklung, technisches SEO und schnelle, sichere Lösungen für Unternehmen.",
    },
    "/services": {
      title: "Webdesign Preise & Leistungen | SynelWeb",
      description:
        "Transparente Preise für Webdesign und Homepage erstellen lassen: individuelle, schnelle und geschäftstaugliche Weblösungen.",
    },
    "/google-ads": {
      title: "Google Ads Betreuung für kleine Unternehmen | SynelWeb",
      description:
        "Google-Suchanzeigen einrichten und betreuen lassen – mit Google-Ads-Search-Zertifizierung: Keyword-Recherche, Conversion-Tracking, monatliche Berichte und transparente Preise.",
    },
    "/site-check": {
      title: "Kostenloser Website-Check: Speed & SEO | SynelWeb",
      description:
        "Prüfe deine Website kostenlos: Google-Lighthouse-Werte für Performance, Barrierefreiheit, Best Practices und SEO, Core Web Vitals und die größten Verbesserungen – mobil und am Desktop.",
    },
    "/projects": {
      title: "Webdesign Referenzen & Projekte | SynelWeb",
      description:
        "Reale Projekte und echte technische Qualität: schnelle, moderne und geschäftstaugliche Weblösungen.",
    },
    "/certificates": {
      title: "Zertifikate: Webentwicklung & Google Ads | SynelWeb",
      description:
        "Überprüfbare Zertifikate in Frontend-, Backend- und Full-Stack-Webentwicklung sowie Google-Suchanzeigen – das Wissen hinter jedem SynelWeb-Projekt.",
    },
    "/blog": {
      title: "Blog zu Webentwicklung & SEO | SynelWeb",
      description:
        "Fachartikel, praktische Webentwicklungsnotizen und geschäftsorientierte Einblicke von SynelWeb.",
    },
    "/technology": {
      title: "Technologie: React, Django, PostgreSQL | SynelWeb",
      description:
        "Moderner Technologie-Stack mit TypeScript, Python, Django und PostgreSQL für schnelle, sichere und zukunftsfähige Systeme.",
    },
    "/contact": {
      title: "Kontakt & Angebot anfordern | SynelWeb",
      description:
        "Kontaktiere SynelWeb per E-Mail, telefonisch oder online – aus Ungarn, Österreich (Burgenland, Wien) oder von überall sonst, mit persönlichen Terminen rund um Sopron.",
    },
  },
};

// Regional landing pages: one language each (see REGIONAL_PAGES).
export const REGIONAL_SEO: Record<RegionalLogicalPath, SeoEntry> = {
  "/sopron": {
    title: "Weboldal készítés Sopron | SynelWeb",
    description:
      "Egyedi, villámgyors weboldal készítés Sopronban és környékén, személyes egyeztetéssel. Kétnyelvű (magyar–német) oldalak osztrák vendégeknek, helyi SEO és Google Cégprofil.",
  },
  "/austria": {
    title: "Webdesign Burgenland & Wien | SynelWeb",
    description:
      "Individuelles, blitzschnelles Webdesign für Unternehmen im Burgenland und in Wien – mit Impressum- und DSGVO-konformer Umsetzung, Preisen in Euro und persönlichen Terminen.",
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

export function buildMeta({ pathname, lang, title, description, image }: BuildMetaInput) {
  const logicalPath = normalizeLogicalPath(pathname) as KnownLogicalPath;
  const fallbackMeta = getSeoEntry(logicalPath, lang);
  const resolvedTitle = title && title.trim().length > 0 ? title : fallbackMeta.title;
  const resolvedDescription =
    description && description.trim().length > 0 ? description : fallbackMeta.description;
  const resolvedImage = image && image.trim().length > 0 ? image : `${SITE_URL}/og-image.png`;
  const urlFor = (path: string) => new URL(path, SITE_URL).toString();

  // Single-language pages name only themselves; a page shown in the wrong
  // language points at the original instead of competing with it:
  // - legal pages are Hungarian and unprefixed (/impresszum),
  // - blog posts are Hungarian, so /en/blog/4 is canonical to /hu/blog/4,
  // - a regional page has no translations.
  let canonicalUrl: string;
  let alternates: Array<{ hreflang: string; href: string }>;
  if (isLegalLogicalPath(logicalPath)) {
    canonicalUrl = urlFor(logicalPath);
    alternates = [{ hreflang: DEFAULT_LANG, href: canonicalUrl }];
  } else if (isBlogPostLogicalPath(logicalPath)) {
    canonicalUrl = urlFor(localizePath(logicalPath, BLOG_POST_LANG));
    alternates = [{ hreflang: BLOG_POST_LANG, href: canonicalUrl }];
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
