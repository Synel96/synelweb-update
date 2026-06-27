import { BRAND_NAME, SITE_URL } from "../components/site";
import { SUPPORTED_LANGS, DEFAULT_LANG, type SupportedLang } from "./i18n-config";

type BuildMetaInput = {
  /** Logical pathname without lang prefix, e.g. "/" or "/about" */
  pathname: string;
  lang: SupportedLang;
  title?: string | null;
  description?: string | null;
};

function langPath(pathname: string, lang: SupportedLang) {
  return pathname === "/" ? `/${lang}/` : `/${lang}${pathname}`;
}

export function buildMeta({ pathname, lang, title, description }: BuildMetaInput) {
  const canonicalUrl = new URL(langPath(pathname, lang), SITE_URL).toString();
  const resolvedTitle = title && title.trim().length > 0 ? title : BRAND_NAME;
  const resolvedDescription =
    description && description.trim().length > 0
      ? description
      : "Starter template page description. Replace with page-specific text.";

  // hreflang alternates for every supported language + x-default pointing to default lang
  const alternates = [
    ...SUPPORTED_LANGS.map((l) => ({
      hreflang: l,
      href: new URL(langPath(pathname, l), SITE_URL).toString(),
    })),
    {
      hreflang: "x-default",
      href: new URL(langPath(pathname, DEFAULT_LANG), SITE_URL).toString(),
    },
  ];

  return {
    canonicalUrl,
    title: resolvedTitle,
    description: resolvedDescription,
    image: `${SITE_URL}/me.webp`,
    alternates,
  };
}
