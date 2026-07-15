import type { TFunction } from "i18next";
import { withCloudinaryAutoParams } from "@/src/cloudinary";
import type { BlogPost } from "@/src/services/blogPostsService";

type BlogPostsDisplayProps = {
  posts: BlogPost[];
  locale: string;
  t: TFunction;
};

function formatCategoryLabel(category: string) {
  const normalized = category.trim().toLowerCase();
  if (normalized === "casual" || normalized === "causula") return "Hétköznapi";
  if (normalized === "professional") return "Szakmai";
  return "Szakmai";
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

function getPostPreviewImageUrl(url: string): string {
  const normalized = url.trim();
  if (!normalized) return "";
  return withCloudinaryAutoParams(normalized);
}

export default function BlogPostsDisplay({ posts, locale, t }: BlogPostsDisplayProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-2" data-reveal>
      {posts.map((post) => {
        const categoryLabel = formatCategoryLabel(post.category);
        const createdAtLabel = formatDate(post.createdAt, locale);
        const previewImageUrl = getPostPreviewImageUrl(post.previewImageUrl);

        return (
          <article
            key={post.id}
            className="overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(155deg,rgba(16,22,42,0.92),rgba(10,15,28,0.95))] shadow-[0_24px_70px_-42px_rgba(0,0,0,0.75)]"
          >
            {previewImageUrl ? (
              <img
                src={previewImageUrl}
                alt={post.title || t("blogPage.untitled")}
                className="h-56 w-full object-cover"
                loading="lazy"
                decoding="async"
                crossOrigin="anonymous"
                referrerPolicy="no-referrer"
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
  );
}
