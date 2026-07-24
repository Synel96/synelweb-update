import { DEFAULT_LANG, type SupportedLang } from "@/src/i18n-config";
import {
  BlogApiError,
  getBlogPosts,
  getBlogPostDetail,
  type BlogPost,
  type BlogPostDetail,
} from "@/src/services/blogPostsService";
import type { AppLang } from "@/src/services/serviceCardsService";

type BlogNavigationPost = Pick<BlogPost, "id" | "title">;

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
      previousPost: null as BlogNavigationPost | null,
      nextPost: null as BlogNavigationPost | null,
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
    const listEntryIndex = posts.findIndex((item) => item.id === post.id || item.id === id);
    const previousPost = listEntryIndex >= 0 && listEntryIndex < posts.length - 1 ? posts[listEntryIndex + 1] : null;
    const nextPost = listEntryIndex > 0 ? posts[listEntryIndex - 1] : null;
    const listEntry = listEntryIndex >= 0 ? posts[listEntryIndex] : null;
    const resolvedDescription = post.description || listEntry?.description || "";

    return {
      post: {
        ...post,
        description: resolvedDescription,
      },
      previousPost: previousPost ? { id: previousPost.id, title: previousPost.title } : null,
      nextPost: nextPost ? { id: nextPost.id, title: nextPost.title } : null,
      fetchError: false,
      notFound: false,
    };
  } catch (error) {
    const notFound = error instanceof BlogApiError && error.status === 404;

    return {
      post: null as BlogPostDetail | null,
      previousPost: null as BlogNavigationPost | null,
      nextPost: null as BlogNavigationPost | null,
      fetchError: !notFound,
      notFound,
    };
  }
}
