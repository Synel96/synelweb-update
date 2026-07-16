import type { SupportedLang } from "../src/i18n-config";
import { DEFAULT_LANG } from "../src/i18n-config";
import { getSeoEntry } from "../src/seo";

export default function title(pageContext: {
  urlPathname: string;
  lang?: SupportedLang;
  data?: {
    post?: {
      title?: string;
    } | null;
  };
}) {
  const lang = pageContext.lang ?? DEFAULT_LANG;
  const blogPostTitle = pageContext.data?.post?.title?.trim();

  if (blogPostTitle) {
    return blogPostTitle;
  }

  return getSeoEntry(pageContext.urlPathname, lang).title;
}