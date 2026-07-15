import type { SupportedLang } from "../src/i18n-config";
import { DEFAULT_LANG } from "../src/i18n-config";
import { getSeoEntry } from "../src/seo";

export default function title(pageContext: { urlPathname: string; lang?: SupportedLang }) {
  const lang = pageContext.lang ?? DEFAULT_LANG;
  return getSeoEntry(pageContext.urlPathname, lang).title;
}