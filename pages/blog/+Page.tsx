import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { usePageContext } from "vike-react/usePageContext";
import BlogPostsDisplay from "@/components/BlogPostsDisplay";
import BlogPostsPagination from "@/components/BlogPostsPagination";
import { getBlogPosts, type BlogPost } from "@/src/services/blogPostsService";
import type { AppLang } from "@/src/services/serviceCardsService";

type Data = {
  posts: BlogPost[];
  fetchError: boolean;
};

const POSTS_PER_PAGE = 6;

function toAppLang(language: string): AppLang {
  const normalized = language.toLowerCase();
  if (normalized.startsWith("hu")) return "hu";
  if (normalized.startsWith("de")) return "de";
  return "en";
}

export default function Page() {
  const { i18n } = useTranslation();
  const pageContext = usePageContext() as { data?: Data; lang?: "en" | "hu" | "de" };
  const initialPosts = pageContext.data?.posts ?? [];
  const initialFetchError = pageContext.data?.fetchError ?? true;

  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [fetchError, setFetchError] = useState(initialFetchError);
  const routeLang = pageContext.lang ?? "en";
  const t = i18n.getFixedT(routeLang);
  const locale = routeLang;
  const isHungarianLocale = routeLang === "hu";
  const [currentPage, setCurrentPage] = useState(1);

  const blogLabel = t("blogPage.label", { defaultValue: "Blog" });
  const blogTitle = t("blogPage.title", {
    defaultValue: "Insights, practical notes, and web strategy articles.",
  });
  const blogIntro = t("blogPage.intro", {
    defaultValue:
      "Here you can find professional articles, implementation notes, and practical observations from real web projects.",
  });

  useEffect(() => {
    setPosts(initialPosts);
    setFetchError(initialFetchError);
  }, [initialPosts, initialFetchError]);

  useEffect(() => {
    let isMounted = true;

    async function refreshPosts() {
      const lang = toAppLang(routeLang);

      try {
        const latestPosts = await getBlogPosts(lang);
        if (!isMounted) return;

        setPosts(latestPosts);
        setFetchError(false);
      } catch {
        if (!isMounted) return;
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
          <p className="text-sm font-medium leading-7 text-amber-100 sm:text-base">
            {t("blogPage.languageNotice", {
              defaultValue: "This blog is currently available only in Hungarian.",
            })}
          </p>
        </div>
      ) : null}

      {fetchError ? (
        <div className="rounded-3xl border border-dashed border-white/15 bg-white/3 p-8 text-center">
          <p className="text-base text-white/86">{t("blogPage.fetchError")}</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-white/15 bg-white/3 p-8 text-center">
          <p className="text-base text-white/86">{t("blogPage.emptyState")}</p>
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