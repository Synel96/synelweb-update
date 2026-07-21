import { DEFAULT_LANG, SUPPORTED_LANGS, type SupportedLang } from "./i18n-config";

export const KNOWN_LOGICAL_PATHS = [
  "/",
  "/about",
  "/services",
  "/projects",
  "/blog",
  "/technology",
  "/contact",
] as const;

export type KnownLogicalPath = (typeof KNOWN_LOGICAL_PATHS)[number];

const LOCALIZED_SEGMENTS: Record<Exclude<KnownLogicalPath, "/">, Record<SupportedLang, string>> = {
  "/about": {
    en: "about",
    hu: "rolam",
    de: "ueber-mich",
  },
  "/services": {
    en: "services",
    hu: "szolgaltatasok",
    de: "dienstleistungen",
  },
  "/projects": {
    en: "projects",
    hu: "projektek",
    de: "projekte",
  },
  "/blog": {
    en: "blog",
    hu: "blog",
    de: "blog",
  },
  "/technology": {
    en: "technology",
    hu: "technologia",
    de: "technologie",
  },
  "/contact": {
    en: "contact",
    hu: "kapcsolat",
    de: "kontakt",
  },
};

const LOGICAL_BY_SEGMENT = Object.fromEntries(
  SUPPORTED_LANGS.map((lang) => [
    lang,
    Object.fromEntries(
      Object.entries(LOCALIZED_SEGMENTS).map(([logicalPath, localizedByLang]) => [
        localizedByLang[lang],
        logicalPath,
      ])
    ),
  ])
) as Record<SupportedLang, Record<string, Exclude<KnownLogicalPath, "/">>>;

export function normalizeLogicalPath(path: string) {
  if (!path || path === "/") return "/";
  const stripped = path.replace(/[?#].*$/, "").replace(/\/+$/, "");
  return stripped.startsWith("/") ? stripped : `/${stripped}`;
}

export function localizePath(path: string, lang: SupportedLang) {
  const normalizedPath = normalizeLogicalPath(path);

  if (normalizedPath === "/") {
    return `/${lang}/`;
  }

  const localizedSegment = LOCALIZED_SEGMENTS[normalizedPath as Exclude<KnownLogicalPath, "/">];
  if (localizedSegment) {
    return `/${lang}/${localizedSegment[lang]}`;
  }

  return `/${lang}${normalizedPath}`;
}

export function toLogicalPath(path: string, lang: SupportedLang) {
  const normalizedPath = normalizeLogicalPath(path);

  if (normalizedPath === "/") {
    return "/";
  }

  const slug = normalizedPath.slice(1);
  return LOGICAL_BY_SEGMENT[lang][slug] ?? normalizedPath;
}

export function resolveLanguageAndLogicalPath(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  const maybeLang = segments[0] as SupportedLang | undefined;

  if (maybeLang && SUPPORTED_LANGS.includes(maybeLang)) {
    const localizedPath = segments.length > 1 ? `/${segments.slice(1).join("/")}` : "/";
    return {
      lang: maybeLang,
      logicalPath: toLogicalPath(localizedPath, maybeLang),
      hasLangPrefix: true,
    };
  }

  return {
    lang: DEFAULT_LANG,
    logicalPath: normalizeLogicalPath(pathname),
    hasLangPrefix: false,
  };
}

export function resolveCurrentLang(lang?: SupportedLang) {
  if (lang && SUPPORTED_LANGS.includes(lang)) {
    return lang;
  }

  if (typeof window !== "undefined") {
    return resolveLanguageAndLogicalPath(window.location.pathname).lang;
  }

  return DEFAULT_LANG;
}