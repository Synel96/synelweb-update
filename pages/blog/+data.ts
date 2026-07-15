import { DEFAULT_LANG, type SupportedLang } from "@/src/i18n-config";
import { getBlogPosts } from "@/src/services/blogPostsService";
import type { AppLang } from "@/src/services/serviceCardsService";

export async function data(pageContext: { lang?: SupportedLang }) {
  const lang = (pageContext.lang ?? DEFAULT_LANG) as AppLang;

  try {
    const posts = await getBlogPosts(lang);
    return {
      posts,
      fetchError: false,
    };
  } catch {
    return {
      posts: [],
      fetchError: true,
    };
  }
}