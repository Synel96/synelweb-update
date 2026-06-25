// pages/+onBeforeRoute.ts
// Extracts the language prefix from the URL and makes it available as
// pageContext.lang. The prefix is stripped so the rest of Vike routing
// works against ordinary paths (e.g. /en/about → routes to pages/about/).
//
// /           → serves default lang (no redirect — avoids extra round-trip)
// /en/about   → urlLogical: /about, lang: "en"
// /hu/        → urlLogical: /,      lang: "hu"
// /unknown    → urlLogical: /unknown, lang: "en" (default)

import { SUPPORTED_LANGS, DEFAULT_LANG, type SupportedLang } from "../src/i18n-config";

export function onBeforeRoute(pageContext: { urlOriginal: string }) {
  const { urlOriginal } = pageContext;
  const url = new URL(urlOriginal, "http://localhost");
  const pathname = url.pathname;

  const segments = pathname.split("/").filter(Boolean);
  const maybeLang = segments[0] as SupportedLang;

  if ((SUPPORTED_LANGS as ReadonlyArray<string>).includes(maybeLang)) {
    const lang = maybeLang;
    const logicalPath = segments.length > 1 ? "/" + segments.slice(1).join("/") : "/";
    return {
      pageContext: {
        lang,
        urlLogical: logicalPath + url.search + url.hash,
      },
    };
  }

  // No lang prefix (including bare /) — serve with default lang, no redirect
  return {
    pageContext: {
      lang: DEFAULT_LANG,
    },
  };
}
