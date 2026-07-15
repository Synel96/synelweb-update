import type { SupportedLang } from "../src/i18n-config";
import { DEFAULT_LANG } from "../src/i18n-config";
import { getSeoEntry } from "../src/seo";

export default function description(pageContext: { urlPathname: string; lang?: SupportedLang }) {
  const lang = pageContext.lang ?? DEFAULT_LANG;
  return getSeoEntry(pageContext.urlPathname, lang).description;
}