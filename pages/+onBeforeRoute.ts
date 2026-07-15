// pages/+onBeforeRoute.ts
// Extracts the language prefix from the URL and makes it available as
// pageContext.lang. The prefix is stripped so the rest of Vike routing
// works against ordinary paths (e.g. /en/about → routes to pages/about/).
//
// /           → serves default lang (no redirect — avoids extra round-trip)
// /en/about   → urlLogical: /about, lang: "en"
// /hu/        → urlLogical: /,      lang: "hu"
// /unknown    → urlLogical: /unknown, lang: "en" (default)

import { resolveLanguageAndLogicalPath } from "../src/localizedRoutes";

export function onBeforeRoute(pageContext: { urlOriginal: string }) {
  const { urlOriginal } = pageContext;
  const url = new URL(urlOriginal, "http://localhost");
  const { lang, logicalPath } = resolveLanguageAndLogicalPath(url.pathname);

  return {
    pageContext: {
      lang,
      urlLogical: logicalPath + url.search + url.hash,
    },
  };
}
