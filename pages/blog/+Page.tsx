import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { usePageContext } from "vike-react/usePageContext";
import BlogPostsDisplay from "@/components/BlogPostsDisplay";
import BlogPostsPagination from "@/components/BlogPostsPagination";
import type { BlogPost } from "@/src/services/blogPostsService";

type Data = {
  posts: BlogPost[];
  fetchError: boolean;
};

const POSTS_PER_PAGE = 6;

export default function Page() {
  const { t, i18n } = useTranslation();
  const pageContext = usePageContext() as { data?: Data };
  const { posts = [], fetchError = true } = pageContext.data ?? {};
  const locale = i18n.resolvedLanguage || i18n.language || "en";
  const [currentPage, setCurrentPage] = useState(1);

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
          {t("blogPage.label")}
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          {t("blogPage.title")}
        </h1>
        <p className="mt-4 text-base leading-8 text-white/80 sm:text-lg">{t("blogPage.intro")}</p>
      </header>

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