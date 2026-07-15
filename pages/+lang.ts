import type { SupportedLang } from "../src/i18n-config";
import { DEFAULT_LANG } from "../src/i18n-config";

export default function lang(pageContext: { lang?: SupportedLang }) {
  return pageContext.lang ?? DEFAULT_LANG;
}