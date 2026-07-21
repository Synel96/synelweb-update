import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { usePageContext } from "vike-react/usePageContext";
import BlogPostsDisplay from "@/components/BlogPostsDisplay";
import BlogPostsDisplaySkeleton from "@/components/BlogPostsDisplaySkeleton";
import BlogPostsPagination from "@/components/BlogPostsPagination";
import BlogPostsPaginationSkeleton from "@/components/BlogPostsPaginationSkeleton";
import { resolveCurrentLang } from "@/src/localizedRoutes";
import { getBlogPosts, type BlogPost } from "@/src/services/blogPostsService";
import type { AppLang } from "@/src/services/serviceCardsService";

type Data = {
  posts: BlogPost[];
  fetchError: boolean;
};

const POSTS_PER_PAGE = 6;

function getBlogPageFallbacks(lang: "en" | "hu" | "de") {
  if (lang === "de") {
    return {
      label: "Blog",
      title: "Fachartikel, praktische Notizen und strategische Web-Beiträge.",
      intro: "Hier findest du Fachbeiträge, Umsetzungsnotizen und praktische Beobachtungen aus realen Webprojekten.",
      languageNotice: "Dieser Blog ist derzeit nur auf Ungarisch verfügbar.",
      fetchError: "Die Blogbeiträge konnten gerade nicht geladen werden. Bitte versuche es später erneut.",
      emptyState: "Derzeit sind keine Blogbeiträge verfügbar.",
    };
  }

  if (lang === "en") {
    return {
      label: "Blog",
      title: "Insights, practical notes, and web strategy articles.",
      intro: "Here you can find professional articles, implementation notes, and practical observations from real web projects.",
      languageNotice: "This blog is currently available only in Hungarian.",
      fetchError: "Blog posts could not be loaded right now. Please try again later.",
      emptyState: "No blog posts are available right now.",
    };
  }

  return {
    label: "Blog",
    title: "Szakmai cikkek, gyakorlati jegyzetek és webes stratégiai írások.",
    intro: "Itt találod a szakmai bejegyzéseimet, megvalósítási tapasztalataimat és a valós webes projektekből származó gyakorlati megfigyeléseket.",
    languageNotice: "Ez a blog jelenleg csak magyar nyelven érhető el.",
    fetchError: "A blogbejegyzések most nem tölthetők be. Kérlek, próbáld meg később.",
    emptyState: "Jelenleg nincs elérhető blogbejegyzés.",
  };
}

function translateWithFallback(
  t: (key: string, options?: { defaultValue?: string }) => string,
  key: string,
  fallback: string,
) {
  const value = t(key, { defaultValue: fallback });
  return value === key ? fallback : value;
}

function toAppLang(language: string): AppLang {
  const normalized = language.toLowerCase();
  if (normalized.startsWith("hu")) return "hu";
  if (normalized.startsWith("de")) return "de";
  return "en";
}

export default function Page() {
  const { i18n } = useTranslation("common");
  const pageContext = usePageContext() as { data?: Data; lang?: "en" | "hu" | "de" };
  const initialPosts = pageContext.data?.posts ?? [];
  const initialFetchError = pageContext.data?.fetchError ?? true;

  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [fetchError, setFetchError] = useState(initialFetchError);
  const [isLoading, setIsLoading] = useState(initialPosts.length === 0 && !initialFetchError);
  const routeLang = resolveCurrentLang(pageContext.lang);
  const fallbacks = getBlogPageFallbacks(routeLang);
  const t = i18n.getFixedT(routeLang, "common");
  const locale = routeLang;
  const isHungarianLocale = routeLang === "hu";
  const [currentPage, setCurrentPage] = useState(1);

  const blogLabel = translateWithFallback(t, "blogPage.label", fallbacks.label);
  const blogTitle = translateWithFallback(t, "blogPage.title", fallbacks.title);
  const blogIntro = translateWithFallback(t, "blogPage.intro", fallbacks.intro);
  const languageNotice = translateWithFallback(t, "blogPage.languageNotice", fallbacks.languageNotice);
  const fetchErrorLabel = translateWithFallback(t, "blogPage.fetchError", fallbacks.fetchError);
  const emptyStateLabel = translateWithFallback(t, "blogPage.emptyState", fallbacks.emptyState);

  useEffect(() => {
    setPosts(initialPosts);
    setFetchError(initialFetchError);
    setIsLoading(initialPosts.length === 0 && !initialFetchError);
  }, [initialPosts, initialFetchError]);

  useEffect(() => {
    let isMounted = true;

    async function refreshPosts() {
      const lang = toAppLang(routeLang);
      setIsLoading(true);
      setFetchError(false);

      try {
        const latestPosts = await getBlogPosts(lang);
        if (!isMounted) return;

        setPosts(latestPosts);
        setFetchError(false);
      } catch {
        if (!isMounted) return;
        setFetchError(true);
      } finally {
        if (!isMounted) return;
        setIsLoading(false);
      }
    }

    refreshPosts();

    return () => {
      isMounted = false;
    };
  }, [routeLang]);

  useEffect(() => {
    setCurrentPage(1);
  }, [posts]);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE));
  }, [posts.length]);

  const paginatedPosts = useMemo(() => {
    const page = Math.min(Math.max(1, currentPage), totalPages);
    const startIndex = (page - 1) * POSTS_PER_PAGE;
    return posts.slice(startIndex, startIndex + POSTS_PER_PAGE);
  }, [posts, currentPage, totalPages]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    setCurrentPage(page);
  };

  return (
    <section className="mx-auto w-full max-w-6xl px-6 pt-36 pb-16 sm:pt-40 sm:pb-20">
      <header className="mb-10 max-w-3xl" data-reveal>
        <p className="text-xs font-semibold tracking-[0.18em] text-(--accent) uppercase">
          {blogLabel}
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          {blogTitle}
        </h1>
        <p className="mt-4 text-base leading-8 text-white/80 sm:text-lg">{blogIntro}</p>
      </header>

      {!isHungarianLocale ? (
        <div
          className="mb-8 rounded-2xl border border-amber-300/40 bg-amber-500/10 px-5 py-4"
          role="status"
        >
          <p className="text-sm font-medium leading-7 text-amber-100 sm:text-base">{languageNotice}</p>
        </div>
      ) : null}

      {isLoading ? (
        <>
          <BlogPostsDisplaySkeleton />
          <BlogPostsPaginationSkeleton />
        </>
      ) : fetchError ? (
        <div className="rounded-3xl border border-dashed border-white/15 bg-white/3 p-8 text-center">
          <p className="text-base text-white/86">{fetchErrorLabel}</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-white/15 bg-white/3 p-8 text-center">
          <p className="text-base text-white/86">{emptyStateLabel}</p>
        </div>
      ) : (
        <>
          <BlogPostsDisplay posts={paginatedPosts} locale={locale} t={t} />
          <BlogPostsPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            t={t}
          />
        </>
      )}
    </section>
  );
}