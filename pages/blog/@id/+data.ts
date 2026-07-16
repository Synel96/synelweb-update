import { DEFAULT_LANG, type SupportedLang } from "@/src/i18n-config";
import {
  BlogApiError,
  getBlogPosts,
  getBlogPostDetail,
  type BlogPostDetail,
} from "@/src/services/blogPostsService";
import type { AppLang } from "@/src/services/serviceCardsService";

type PageContext = {
  lang?: SupportedLang;
  routeParams?: {
    id?: string;
  };
};

function toAppLang(language: SupportedLang): AppLang {
  if (language === "hu") return "hu";
  if (language === "de") return "de";
  return "en";
}

export async function data(pageContext: PageContext) {
  const id = pageContext.routeParams?.id?.trim() ?? "";

  if (!id) {
    return {
      post: null as BlogPostDetail | null,
      fetchError: false,
      notFound: true,
    };
  }

  const lang = toAppLang(pageContext.lang ?? DEFAULT_LANG);

  try {
    const [post, posts] = await Promise.all([
      getBlogPostDetail(id, lang),
      getBlogPosts(lang).catch(() => []),
    ]);
    const listEntry = posts.find((item) => item.id === post.id || item.id === id);
    const resolvedDescription = post.description || listEntry?.description || "";

    return {
      post: {
        ...post,
        description: resolvedDescription,
      },
      fetchError: false,
      notFound: false,
    };
  } catch (error) {
    const notFound = error instanceof BlogApiError && error.status === 404;

    return {
      post: null as BlogPostDetail | null,
      fetchError: !notFound,
      notFound,
    };
  }
}
