import type { TFunction } from "i18next";
import { withCloudinaryAutoParams } from "@/src/cloudinary";
import SharePostButton from "@/components/SharePostButton";
import { DEFAULT_LANG, SUPPORTED_LANGS, type SupportedLang } from "@/src/i18n-config";
import type { BlogPost } from "@/src/services/blogPostsService";

type BlogPostsDisplayProps = {
  posts: BlogPost[];
  locale: string;
  t: TFunction;
};

function getBlogDisplayFallbacks(locale: string) {
  const lang = resolveLangPrefix(locale);

  if (lang === "de") {
    return {
      casual: "Allgemein",
      dirtyFinancials: "Heikle Finanzen",
      professional: "Fachlich",
      shareAction: "Teilen",
      shareCopy: "Link kopieren",
      shareCopied: "Link kopiert",
      shareFallbackTitle: "Teilen",
      shareNativeHint: "Instagram/Story-Optionen sind auf Mobilgeräten im nativen Teilen-Menü verfügbar.",
      readMore: "Vollständigen Beitrag lesen",
    };
  }

  if (lang === "en") {
    return {
      casual: "Casual",
      dirtyFinancials: "Dirty financials",
      professional: "Professional",
      shareAction: "Share",
      shareCopy: "Copy link",
      shareCopied: "Link copied",
      shareFallbackTitle: "Share",
      shareNativeHint: "Instagram/Story options are available in the native share sheet on mobile.",
      readMore: "Read full post",
    };
  }

  return {
    casual: "Hétköznapi",
    dirtyFinancials: "Piszkos anyagiak",
    professional: "Szakmai",
    shareAction: "Megosztás",
    shareCopy: "Link másolása",
    shareCopied: "Link másolva",
    shareFallbackTitle: "Megosztás",
    shareNativeHint: "Instagram/Story opció mobilon a rendszer megosztóban érhető el.",
    readMore: "Teljes cikk",
  };
}

function translateWithFallback(t: TFunction, key: string, fallback: string) {
  const value = t(key, { defaultValue: fallback });
  return value === key ? fallback : value;
}

function formatCategoryLabel(category: string) {
  const normalized = category.trim().toLowerCase();
  if (normalized === "casual") return "casual";
  if (normalized === "dirty-financials") return "dirtyFinancials";
  return "professional";
}

function formatDate(value: string, locale: string) {
  const parsed = Date.parse(value);
  if (Number.isNaN(parsed)) return "";

  const date = new Date(parsed);
  const year = date.getUTCFullYear();
  const huMonths = [
    "január",
    "február",
    "március",
    "április",
    "május",
    "június",
    "július",
    "augusztus",
    "szeptember",
    "október",
    "november",
    "december",
  ];
  const month = huMonths[date.getUTCMonth()];
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}. ${month} ${day}.`;
}

function getPostPreviewImageUrl(url: string): string {
  const normalized = url.trim();
  if (!normalized) return "";
  return withCloudinaryAutoParams(normalized);
}

function resolveLangPrefix(locale: string): SupportedLang {
  const base = locale.trim().toLowerCase().split(/[-_]/)[0];
  return SUPPORTED_LANGS.find((lang) => lang === base) ?? DEFAULT_LANG;
}

export default function BlogPostsDisplay({ posts, locale, t }: BlogPostsDisplayProps) {
  const langPrefix = resolveLangPrefix(locale);
  const fallbacks = getBlogDisplayFallbacks(locale);
  const shareActionLabel = translateWithFallback(t, "blogPage.share.action", fallbacks.shareAction);
  const shareCopyLabel = translateWithFallback(t, "blogPage.share.copy", fallbacks.shareCopy);
  const shareCopiedLabel = translateWithFallback(t, "blogPage.share.copied", fallbacks.shareCopied);
  const shareFallbackTitle = translateWithFallback(t, "blogPage.share.fallbackTitle", fallbacks.shareFallbackTitle);
  const shareNativeHintLabel = translateWithFallback(
    t,
    "blogPage.share.nativeHint",
    fallbacks.shareNativeHint,
  );

  return (
    <div className="grid gap-6 lg:grid-cols-2" data-reveal>
      {posts.map((post) => {
        const categoryKey = formatCategoryLabel(post.category);
        const categoryLabel =
          categoryKey === "casual"
            ? translateWithFallback(t, "blogPage.categories.casual", fallbacks.casual)
            : categoryKey === "dirtyFinancials"
              ? translateWithFallback(t, "blogPage.categories.dirtyFinancials", fallbacks.dirtyFinancials)
              : translateWithFallback(t, "blogPage.categories.professional", fallbacks.professional);
        const createdAtLabel = formatDate(post.createdAt, locale);
        const previewImageUrl = getPostPreviewImageUrl(post.previewImageUrl);
        const detailHref = `/${langPrefix}/blog/${encodeURIComponent(post.id)}`;

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

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <a
                  href={detailHref}
                  className="inline-flex items-center rounded-full border border-(--accent)/55 bg-(--accent)/15 px-5 py-2 text-sm font-semibold tracking-[0.04em] text-(--accent) transition hover:border-(--accent)/75 hover:bg-(--accent)/24"
                >
                  {translateWithFallback(t, "blogPage.readMore", fallbacks.readMore)}
                </a>
                <SharePostButton
                  url={detailHref}
                  title={post.title || t("blogPage.untitled")}
                  text={post.description || ""}
                  actionLabel={shareActionLabel}
                  copyLabel={shareCopyLabel}
                  copiedLabel={shareCopiedLabel}
                  fallbackTitle={shareFallbackTitle}
                  nativeHintLabel={shareNativeHintLabel}
                  className="inline-flex items-center rounded-full border border-white/20 bg-white/6 px-5 py-2 text-sm font-semibold tracking-[0.04em] text-white/86 transition hover:border-white/35 hover:bg-white/10"
                />
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
