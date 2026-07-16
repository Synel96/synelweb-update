import { BRAND_NAME, SITE_URL } from "../components/site";
import { SUPPORTED_LANGS, DEFAULT_LANG, type SupportedLang } from "./i18n-config";
import { localizePath, normalizeLogicalPath, type KnownLogicalPath } from "./localizedRoutes";

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
      title: "SynelWeb | Home",
      description: "SynelWeb builds modern, fast, premium websites for businesses.",
    },
    "/about": {
      title: "About | SynelWeb",
      description:
        "Learn how I work: custom web development, technical SEO, and fast, secure solutions for businesses.",
    },
    "/services": {
      title: "Services | SynelWeb",
      description:
        "Services and development approach in one place: custom, fast, and business-ready web solutions.",
    },
    "/projects": {
      title: "Projects | SynelWeb",
      description:
        "Real projects and real technical quality: fast, modern, business-ready web solutions.",
    },
    "/blog": {
      title: "Blog | SynelWeb",
      description:
        "Insights, practical web development notes, and business-focused articles from SynelWeb.",
    },
    "/technology": {
      title: "Technology | SynelWeb",
      description:
        "Modern technology stack with TypeScript, Python, Django, and PostgreSQL for fast, secure, future-ready systems.",
    },
    "/contact": {
      title: "Contact | SynelWeb",
      description:
        "Contact SynelWeb by email, phone, or through an in-person meeting in Sopron.",
    },
  },
  hu: {
    "/": {
      title: "SynelWeb | Főoldal",
      description: "SynelWeb - modern, gyors és prémium weboldalak vállalkozásoknak.",
    },
    "/about": {
      title: "Rólam | SynelWeb",
      description:
        "Ismerd meg, hogyan dolgozom: egyedi webfejlesztés, technikai SEO, gyors és biztonságos megoldások helyi vállalkozásoknak.",
    },
    "/services": {
      title: "Szolgáltatások | SynelWeb",
      description:
        "Szolgáltatásaim és fejlesztési szemléletem egy helyen: egyedi, gyors és üzletileg használható webes megoldások.",
    },
    "/projects": {
      title: "Projektek | SynelWeb",
      description:
        "Valós projektek, valós technikai minőség: gyors, modern és üzletileg használható webes megoldások.",
    },
    "/blog": {
      title: "Blog | SynelWeb",
      description:
        "Szakmai cikkek, gyakorlati webfejlesztési tapasztalatok és üzleti szemléletű bejegyzések a SynelWebtől.",
    },
    "/technology": {
      title: "Technológia | SynelWeb",
      description:
        "Modern technológiai háttér TypeScripttel, Pythonnal, Djangóval és PostgreSQL-lel: gyors, biztonságos és jövőálló webes rendszerek.",
    },
    "/contact": {
      title: "SynelWeb | Kapcsolat",
      description:
        "Lépj kapcsolatba a SynelWebbel e-mailben, telefonon vagy a soproni térképes helyszínen.",
    },
  },
  de: {
    "/": {
      title: "SynelWeb | Startseite",
      description: "SynelWeb erstellt moderne, schnelle und hochwertige Websites für Unternehmen.",
    },
    "/about": {
      title: "Über mich | SynelWeb",
      description:
        "Erfahre, wie ich arbeite: individuelle Webentwicklung, technisches SEO und schnelle, sichere Lösungen für Unternehmen.",
    },
    "/services": {
      title: "Leistungen | SynelWeb",
      description:
        "Leistungen und Entwicklungsansatz an einem Ort: individuelle, schnelle und geschäftstaugliche Weblösungen.",
    },
    "/projects": {
      title: "Projekte | SynelWeb",
      description:
        "Reale Projekte und echte technische Qualität: schnelle, moderne und geschäftstaugliche Weblösungen.",
    },
    "/blog": {
      title: "Blog | SynelWeb",
      description:
        "Fachartikel, praktische Webentwicklungsnotizen und geschäftsorientierte Einblicke von SynelWeb.",
    },
    "/technology": {
      title: "Technologie | SynelWeb",
      description:
        "Moderner Technologie-Stack mit TypeScript, Python, Django und PostgreSQL für schnelle, sichere und zukunftsfähige Systeme.",
    },
    "/contact": {
      title: "Kontakt | SynelWeb",
      description:
        "Kontaktiere SynelWeb per E-Mail, telefonisch oder bei einem persönlichen Termin in Sopron.",
    },
  },
};

export function getSeoEntry(pathname: string, lang: SupportedLang): SeoEntry {
  const logicalPath = normalizeLogicalPath(pathname) as KnownLogicalPath;
  return PAGE_SEO[lang][logicalPath] ?? { title: BRAND_NAME, description: "" };
}

export function buildMeta({ pathname, lang, title, description, image }: BuildMetaInput) {
  const logicalPath = normalizeLogicalPath(pathname) as KnownLogicalPath;
  const fallbackMeta = getSeoEntry(logicalPath, lang);
  const canonicalUrl = new URL(localizePath(logicalPath, lang), SITE_URL).toString();
  const resolvedTitle = title && title.trim().length > 0 ? title : fallbackMeta.title;
  const resolvedDescription =
    description && description.trim().length > 0
      ? description
      : fallbackMeta.description;
  const resolvedImage = image && image.trim().length > 0 ? image : `${SITE_URL}/me.webp`;

  // hreflang alternates for every supported language + x-default pointing to default lang
  const alternates = [
    ...SUPPORTED_LANGS.map((l) => ({
      hreflang: l,
      href: new URL(localizePath(logicalPath, l), SITE_URL).toString(),
    })),
    {
      hreflang: "x-default",
      href: new URL(localizePath(logicalPath, DEFAULT_LANG), SITE_URL).toString(),
    },
  ];

  return {
    canonicalUrl,
    title: resolvedTitle,
    description: resolvedDescription,
    image: resolvedImage,
    alternates,
  };
}
