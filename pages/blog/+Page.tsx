import { useTranslation } from "react-i18next";
import { usePageContext } from "vike-react/usePageContext";
import type { BlogPost } from "@/src/services/blogPostsService";

type Data = {
  posts: BlogPost[];
  fetchError: boolean;
};

function formatCategoryLabel(category: string, t: (key: string) => string) {
  const normalized = category.trim().toLowerCase();
  if (!normalized) return t("blogPage.categoryFallback");

  const translationKey = `blogPage.categories.${normalized}` as const;
  const translated = t(translationKey);
  if (translated !== translationKey) return translated;

  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

function formatDate(value: string, locale: string) {
  const parsed = Date.parse(value);
  if (Number.isNaN(parsed)) return "";

  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(parsed));
}

export default function Page() {
  const { t, i18n } = useTranslation();
  const pageContext = usePageContext() as { data?: Data };
  const { posts = [], fetchError = true } = pageContext.data ?? {};
  const locale = i18n.resolvedLanguage || i18n.language || "en";

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
        <div className="grid gap-6 lg:grid-cols-2" data-reveal>
          {posts.map((post) => {
            const categoryLabel = formatCategoryLabel(post.category, t);
            const createdAtLabel = formatDate(post.createdAt, locale);

            return (
              <article
                key={post.id}
                className="overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(155deg,rgba(16,22,42,0.92),rgba(10,15,28,0.95))] shadow-[0_24px_70px_-42px_rgba(0,0,0,0.75)]"
              >
                {post.previewImageUrl ? (
                  <img
                    src={post.previewImageUrl}
                    alt={post.title}
                    className="h-56 w-full object-cover"
                    loading="lazy"
                  />
                ) : null}

                <div className="p-6 sm:p-7">
                  <div className="flex flex-wrap items-center gap-3 text-xs font-semibold tracking-[0.14em] uppercase">
                    <span className="rounded-full border border-white/12 bg-white/6 px-3 py-1 text-(--accent)">
                      {categoryLabel}
                    </span>
                    {createdAtLabel ? <span className="text-white/50">{createdAtLabel}</span> : null}
                  </div>

                  <h2 className="mt-4 text-2xl font-semibold tracking-tight text-white">
                    {post.title || t("blogPage.untitled")}
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-white/78 sm:text-base">
                    {post.description || t("blogPage.descriptionFallback")}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}