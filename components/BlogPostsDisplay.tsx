import { useEffect, useRef, useState } from "react";
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
      shareNativeHint:
        "Instagram/Story-Optionen sind auf Mobilgeräten im nativen Teilen-Menü verfügbar.",
      readMore: "Vollständigen Beitrag lesen",
      expandDescription: "Mehr",
      collapseDescription: "Weniger",
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
      expandDescription: "Read more",
      collapseDescription: "Show less",
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
    expandDescription: "Több",
    collapseDescription: "Kevesebb",
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

function getCategoryBadgeClassName(categoryKey: ReturnType<typeof formatCategoryLabel>) {
  if (categoryKey === "casual") {
    return "border-transparent bg-(--secondary) text-white";
  }
  if (categoryKey === "dirtyFinancials") {
    return "border-transparent bg-[linear-gradient(120deg,var(--color-secondary-warm),var(--color-secondary-hot)_62%,var(--color-secondary-warm))] text-[#1a0a06]";
  }
  return "border-transparent bg-(--accent) text-white";
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

type BlogPostCardProps = {
  post: BlogPost;
  categoryLabel: string;
  categoryClassName: string;
  createdAtLabel: string;
  previewImageUrl: string;
  detailHref: string;
  untitledLabel: string;
  descriptionFallbackLabel: string;
  readMoreLabel: string;
  expandLabel: string;
  collapseLabel: string;
  shareActionLabel: string;
  shareCopyLabel: string;
  shareCopiedLabel: string;
  shareFallbackTitle: string;
  shareNativeHintLabel: string;
};

function BlogPostCard({
  post,
  categoryLabel,
  categoryClassName,
  createdAtLabel,
  previewImageUrl,
  detailHref,
  untitledLabel,
  descriptionFallbackLabel,
  readMoreLabel,
  expandLabel,
  collapseLabel,
  shareActionLabel,
  shareCopyLabel,
  shareCopiedLabel,
  shareFallbackTitle,
  shareNativeHintLabel,
}: BlogPostCardProps) {
  const description = post.description || descriptionFallbackLabel;
  const hasLongDescription = description.trim().length > 220;
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [expandedHeight, setExpandedHeight] = useState(0);
  const descriptionRef = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    const element = descriptionRef.current;
    if (!element) return;
    setExpandedHeight(element.scrollHeight);
  }, [description]);

  return (
    <article className="w-[85%] shrink-0 snap-start overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(155deg,rgba(16,22,42,0.92),rgba(10,15,28,0.95))] shadow-[0_24px_70px_-42px_rgba(0,0,0,0.75)] sm:w-[60%] lg:w-auto lg:shrink">
      {previewImageUrl ? (
        <img
          src={previewImageUrl}
          alt={post.title || untitledLabel}
          className="h-56 w-full object-cover"
          loading="lazy"
          decoding="async"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      ) : null}

      <div className="p-6 sm:p-7">
        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold tracking-[0.14em] uppercase">
          <span className={`rounded-full border px-3 py-1 ${categoryClassName}`}>
            {categoryLabel}
          </span>
          {createdAtLabel ? <span className="text-white/50">{createdAtLabel}</span> : null}
        </div>

        <h2 className="mt-4 text-2xl font-semibold tracking-tight text-white">
          {post.title || untitledLabel}
        </h2>

        {/* Collapsed to 0 on phones so the list only shows titles by default;
            on sm+ screens a long description still gets a fixed-height preview,
            while a short one is simply shown in full (no collapsing needed there). */}
        <div
          className={`mt-4 max-h-0 overflow-hidden transition-[max-height] duration-400 ease-in-out ${
            hasLongDescription ? "sm:max-h-24" : "sm:max-h-none"
          }`}
          style={isDescriptionExpanded ? { maxHeight: `${expandedHeight}px` } : undefined}
        >
          <p ref={descriptionRef} className="text-sm leading-7 text-white/78 sm:text-base">
            {description}
          </p>
        </div>

        <button
          type="button"
          className={`mt-3 inline-flex items-center text-sm font-semibold tracking-[0.08em] text-(--accent) uppercase transition-opacity hover:opacity-80 ${
            hasLongDescription ? "" : "sm:hidden"
          }`}
          onClick={() => setIsDescriptionExpanded((current) => !current)}
          aria-expanded={isDescriptionExpanded}
        >
          {isDescriptionExpanded ? collapseLabel : expandLabel}
        </button>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <a
            href={detailHref}
            className="inline-flex items-center rounded-full border border-(--accent)/55 bg-(--accent)/15 px-5 py-2 text-sm font-semibold tracking-[0.04em] text-(--accent) transition hover:border-(--accent)/75 hover:bg-(--accent)/24"
          >
            {readMoreLabel}
          </a>
          <SharePostButton
            url={detailHref}
            title={post.title || untitledLabel}
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
}

export default function BlogPostsDisplay({ posts, locale, t }: BlogPostsDisplayProps) {
  const langPrefix = resolveLangPrefix(locale);
  const fallbacks = getBlogDisplayFallbacks(locale);
  const untitledLabel = t("blogPage.untitled");
  const descriptionFallbackLabel = t("blogPage.descriptionFallback");
  const expandLabel = translateWithFallback(
    t,
    "blogPage.expandDescription",
    fallbacks.expandDescription
  );
  const collapseLabel = translateWithFallback(
    t,
    "blogPage.collapseDescription",
    fallbacks.collapseDescription
  );
  const shareActionLabel = translateWithFallback(t, "blogPage.share.action", fallbacks.shareAction);
  const shareCopyLabel = translateWithFallback(t, "blogPage.share.copy", fallbacks.shareCopy);
  const shareCopiedLabel = translateWithFallback(t, "blogPage.share.copied", fallbacks.shareCopied);
  const shareFallbackTitle = translateWithFallback(
    t,
    "blogPage.share.fallbackTitle",
    fallbacks.shareFallbackTitle
  );
  const shareNativeHintLabel = translateWithFallback(
    t,
    "blogPage.share.nativeHint",
    fallbacks.shareNativeHint
  );

  return (
    <div
      className="no-scrollbar -mx-6 flex snap-x snap-mandatory scroll-px-6 gap-6 overflow-x-auto scroll-smooth px-6 pb-2 lg:mx-0 lg:grid lg:grid-cols-2 lg:overflow-visible lg:px-0 lg:pb-0"
      data-reveal
    >
      {posts.map((post) => {
        const categoryKey = formatCategoryLabel(post.category);
        const categoryLabel =
          categoryKey === "casual"
            ? translateWithFallback(t, "blogPage.categories.casual", fallbacks.casual)
            : categoryKey === "dirtyFinancials"
              ? translateWithFallback(
                  t,
                  "blogPage.categories.dirtyFinancials",
                  fallbacks.dirtyFinancials
                )
              : translateWithFallback(
                  t,
                  "blogPage.categories.professional",
                  fallbacks.professional
                );
        const createdAtLabel = formatDate(post.createdAt, locale);
        const previewImageUrl = getPostPreviewImageUrl(post.previewImageUrl);
        const detailHref = `/${langPrefix}/blog/${encodeURIComponent(post.id)}`;

        return (
          <BlogPostCard
            key={post.id}
            post={post}
            categoryLabel={categoryLabel}
            categoryClassName={getCategoryBadgeClassName(categoryKey)}
            createdAtLabel={createdAtLabel}
            previewImageUrl={previewImageUrl}
            detailHref={detailHref}
            untitledLabel={untitledLabel}
            descriptionFallbackLabel={descriptionFallbackLabel}
            readMoreLabel={translateWithFallback(t, "blogPage.readMore", fallbacks.readMore)}
            expandLabel={expandLabel}
            collapseLabel={collapseLabel}
            shareActionLabel={shareActionLabel}
            shareCopyLabel={shareCopyLabel}
            shareCopiedLabel={shareCopiedLabel}
            shareFallbackTitle={shareFallbackTitle}
            shareNativeHintLabel={shareNativeHintLabel}
          />
        );
      })}
    </div>
  );
}
