import { useTranslation } from "react-i18next";
import { usePageContext } from "vike-react/usePageContext";
import { withCloudinaryAutoParams } from "@/src/cloudinary";
import type { BlogPostDetail } from "@/src/services/blogPostsService";

type Data = {
  post: BlogPostDetail | null;
  fetchError: boolean;
  notFound: boolean;
};

function normalizeCategory(category: string) {
  const normalized = category.trim().toLowerCase();
  if (normalized === "casual") return "casual";
  return "professional";
}

function formatDate(value: string, locale: string) {
  const parsed = Date.parse(value);
  if (Number.isNaN(parsed)) return "";

  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(parsed));
}

function getPostPreviewImageUrl(url: string): string {
  const normalized = url.trim();
  if (!normalized) return "";
  return withCloudinaryAutoParams(normalized);
}

function translateWithFallback(
  t: (key: string, options?: { defaultValue?: string }) => string,
  key: string,
  fallback: string,
) {
  const value = t(key, { defaultValue: fallback });
  return value === key ? fallback : value;
}

export default function Page() {
  const { i18n } = useTranslation("common");
  const pageContext = usePageContext() as { data?: Data; lang?: "en" | "hu" | "de" };

  const data = pageContext.data ?? {
    post: null,
    fetchError: true,
    notFound: false,
  };

  const routeLang = pageContext.lang ?? "en";
  const t = i18n.getFixedT(routeLang, "common");
  const locale = routeLang;
  const blogListHref = `/${pageContext.lang ?? "en"}/blog`;
  const backToListLabel = translateWithFallback(t, "blogDetail.backToList", "← Vissza a bloghoz");
  const backToTopLabel = translateWithFallback(t, "blogDetail.backToTop", "↑ Oldal tetejére");

  if (data.notFound) {
    return (
      <section className="mx-auto w-full max-w-4xl px-6 pt-36 pb-16 sm:pt-40 sm:pb-20">
        <div className="rounded-3xl border border-dashed border-white/15 bg-white/3 p-8 text-center">
          <p className="text-base text-white/86">{t("blogDetail.notFound")}</p>
          <a
            href={blogListHref}
            className="mt-6 inline-flex items-center rounded-full border border-(--accent)/55 bg-(--accent)/15 px-5 py-2 text-sm font-semibold tracking-[0.04em] text-(--accent) transition hover:border-(--accent)/75 hover:bg-(--accent)/24"
          >
            {backToListLabel}
          </a>
        </div>
      </section>
    );
  }

  if (data.fetchError || !data.post) {
    return (
      <section className="mx-auto w-full max-w-4xl px-6 pt-36 pb-16 sm:pt-40 sm:pb-20">
        <div className="rounded-3xl border border-dashed border-white/15 bg-white/3 p-8 text-center">
          <p className="text-base text-white/86">{t("blogDetail.fetchError")}</p>
          <a
            href={blogListHref}
            className="mt-6 inline-flex items-center rounded-full border border-(--accent)/55 bg-(--accent)/15 px-5 py-2 text-sm font-semibold tracking-[0.04em] text-(--accent) transition hover:border-(--accent)/75 hover:bg-(--accent)/24"
          >
            {backToListLabel}
          </a>
        </div>
      </section>
    );
  }

  const { post } = data;
  const categoryKey = normalizeCategory(post.category);
  const categoryLabel =
    categoryKey === "casual"
      ? translateWithFallback(t, "blogPage.categories.casual", "Hétköznapi")
      : translateWithFallback(t, "blogPage.categories.professional", "Szakmai");
  const createdAtLabel = formatDate(post.createdAt, locale);
  const previewImageUrl = getPostPreviewImageUrl(post.previewImageUrl);

  return (
    <article id="blog-post-top" className="mx-auto w-full max-w-4xl px-6 pt-36 pb-16 sm:pt-40 sm:pb-20">
      <a
        href={blogListHref}
        className="mb-6 inline-flex items-center text-sm font-semibold tracking-[0.04em] text-(--accent) transition hover:text-white"
      >
        {backToListLabel}
      </a>

      <header className="overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(160deg,rgba(14,20,38,0.95),rgba(8,12,24,0.96))] shadow-[0_24px_80px_-42px_rgba(0,0,0,0.72)]">
        {previewImageUrl ? (
          <img
            src={previewImageUrl}
            alt={post.title || t("blogPage.untitled")}
            className="h-64 w-full object-cover sm:h-80"
            loading="eager"
            decoding="async"
            crossOrigin="anonymous"
            referrerPolicy="no-referrer"
          />
        ) : null}

        <div className="px-6 pt-6 pb-7 sm:px-10 sm:pt-8 sm:pb-9">
          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold tracking-[0.16em] uppercase">
            <p className="text-(--accent)">{t("blogPage.label")}</p>
            <span className="rounded-full border border-white/12 bg-white/6 px-3 py-1 text-(--accent)">
              {categoryLabel}
            </span>
          </div>
          <h1 className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">
            {post.title || t("blogPage.untitled")}
          </h1>
          {createdAtLabel ? <p className="mt-4 text-sm text-white/65">{createdAtLabel}</p> : null}
        </div>
      </header>

      <section className="mt-10 space-y-7">
        {post.sections.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 bg-white/3 p-6 text-center">
            <p className="text-base text-white/82">{t("blogDetail.emptySections")}</p>
          </div>
        ) : (
          post.sections.map((section, index) => (
            <section
              key={section.id}
              className="rounded-2xl border border-white/10 bg-[linear-gradient(145deg,rgba(17,24,44,0.78),rgba(11,16,31,0.88))] px-6 py-6 shadow-[0_18px_52px_-36px_rgba(0,0,0,0.75)] sm:px-8"
            >
              <h2 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
                {section.subtitle || `${t("blogDetail.sectionFallbackTitle")} ${index + 1}`}
              </h2>
              <p className="mt-4 whitespace-pre-line text-base leading-8 text-white/84">
                {section.content || t("blogDetail.sectionFallbackContent")}
              </p>
            </section>
          ))
        )}
      </section>

      <div className="mt-10 flex flex-wrap items-center gap-3">
        <a
          href={blogListHref}
          className="inline-flex items-center rounded-full border border-(--accent)/55 bg-(--accent)/15 px-5 py-2 text-sm font-semibold tracking-[0.04em] text-(--accent) transition hover:border-(--accent)/75 hover:bg-(--accent)/24"
        >
          {backToListLabel}
        </a>
        <a
          href="#blog-post-top"
          className="inline-flex items-center rounded-full border border-white/20 bg-white/5 px-5 py-2 text-sm font-semibold tracking-[0.04em] text-white/86 transition hover:border-white/35 hover:bg-white/10"
        >
          {backToTopLabel}
        </a>
      </div>
    </article>
  );
}
