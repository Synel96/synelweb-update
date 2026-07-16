import type { SupportedLang } from "../src/i18n-config";
import { DEFAULT_LANG } from "../src/i18n-config";
import { getSeoEntry } from "../src/seo";

export default function description(pageContext: {
  urlPathname: string;
  lang?: SupportedLang;
  data?: {
    post?: {
      description?: string;
    } | null;
  };
}) {
  const lang = pageContext.lang ?? DEFAULT_LANG;
  const blogPostDescription = pageContext.data?.post?.description?.trim();

  if (blogPostDescription) {
    return blogPostDescription;
  }

  return getSeoEntry(pageContext.urlPathname, lang).description;
}