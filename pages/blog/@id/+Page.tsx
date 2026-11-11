import ReactMarkdown from "react-markdown";
import { useTranslation } from "react-i18next";
import { usePageContext } from "vike-react/usePageContext";
import remarkGfm from "remark-gfm";
import SharePostButton from "@/components/SharePostButton";
import { withCloudinaryAutoParams } from "@/src/cloudinary";
import { ConversionCtaButton } from "@/components/ConversionCtaButton";
import { env } from "@/src/env";
import { localizePath, resolveCurrentLang } from "@/src/localizedRoutes";
import { quoteFormHref } from "@/src/quoteForm";
import { trackEvent } from "@/src/analytics";
import type { BlogPostDetail } from "@/src/services/blogPostsService";

// A relative path ("/kapcsolat") or an absolute link back to the site itself
// (post authors sometimes paste the full https://synelweb.hu/... URL) should
// navigate in the same tab like any other internal link; only links that
// actually leave the site belong in a new tab.
function isInternalHref(href: string) {
  return href.startsWith("/") || href.startsWith(env.VITE_SITE_URL);
}

export const markdownComponents = {
  h1: ({ children }: { children?: React.ReactNode }) => (
    <h2 className="mt-6 text-xl font-semibold tracking-tight text-white sm:text-2xl">{children}</h2>
  ),
  h2: ({ children }: { children?: React.ReactNode }) => (
    <h2 className="mt-6 text-xl font-semibold tracking-tight text-white sm:text-2xl">{children}</h2>
  ),
  h3: ({ children }: { children?: React.ReactNode }) => (
    <h3 className="mt-5 text-lg font-semibold tracking-tight text-white">{children}</h3>
  ),
  p: ({ children }: { children?: React.ReactNode }) => (
    <p className="mt-4 text-base leading-8 text-white/84">{children}</p>
  ),
  a: ({ href, children }: { href?: string; children?: React.ReactNode }) => {
    const external = !href || !isInternalHref(href);
    return (
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className="text-(--accent) underline underline-offset-2 hover:text-white"
      >
        {children}
      </a>
    );
  },
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul className="mt-4 list-disc space-y-2 pl-6 text-base leading-8 text-white/84">{children}</ul>
  ),
  ol: ({ children }: { children?: React.ReactNode }) => (
    <ol className="mt-4 list-decimal space-y-2 pl-6 text-base leading-8 text-white/84">
      {children}
    </ol>
  ),
  li: ({ children }: { children?: React.ReactNode }) => <li>{children}</li>,
  blockquote: ({ children }: { children?: React.ReactNode }) => (
    <blockquote className="mt-4 border-l-2 border-(--accent)/55 pl-4 text-white/72 italic">
      {children}
    </blockquote>
  ),
  code: ({ className, children }: { className?: string; children?: React.ReactNode }) => {
    const isBlock = Boolean(className);
    if (!isBlock) {
      return (
        <code className="rounded bg-white/10 px-1.5 py-0.5 text-[0.9em] text-(--accent)">
          {children}
        </code>
      );
    }
    return <code className={className}>{children}</code>;
  },
  pre: ({ children }: { children?: React.ReactNode }) => (
    <pre className="mt-4 overflow-x-auto rounded-2xl border border-white/10 bg-black/40 p-4 text-sm leading-7 text-white/88">
      {children}
    </pre>
  ),
  table: ({ children }: { children?: React.ReactNode }) => (
    <div className="mt-4 overflow-x-auto rounded-2xl border border-white/10">
      <table className="w-full border-collapse text-left text-sm text-white/84">{children}</table>
    </div>
  ),
  th: ({ children }: { children?: React.ReactNode }) => (
    <th className="border-b border-white/12 bg-white/5 px-4 py-2 font-semibold text-white">
      {children}
    </th>
  ),
  td: ({ children }: { children?: React.ReactNode }) => (
    <td className="border-b border-white/8 px-4 py-2">{children}</td>
  ),
  hr: () => <hr className="mt-6 border-white/10" />,
};

type Data = {
  post: BlogPostDetail | null;
  previousPost: { id: string; title: string } | null;
  nextPost: { id: string; title: string } | null;
  fetchError: boolean;
  notFound: boolean;
};

function normalizeCategory(category: string) {
  const normalized = category.trim().toLowerCase();
  if (normalized === "casual") return "casual";
  if (normalized === "dirty-financials") return "dirtyFinancials";
  return "professional";
}

function getCategoryBadgeClassName(categoryKey: ReturnType<typeof normalizeCategory>) {
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

function translateWithFallback(
  t: (key: string, options?: { defaultValue?: string }) => string,
  key: string,
  fallback: string
) {
  const value = t(key, { defaultValue: fallback });
  return value === key ? fallback : value;
}

export default function Page() {
  const { i18n } = useTranslation("common");
  const pageContext = usePageContext() as { data?: Data; lang?: "en" | "hu" | "de" };

  const data = pageContext.data ?? {
    post: null,
    previousPost: null,
    nextPost: null,
    fetchError: true,
    notFound: false,
  };

  const routeLang = resolveCurrentLang(pageContext.lang);
  const t = i18n.getFixedT(routeLang, "common");
  const locale = routeLang;
  const blogListHref = `/${routeLang}/blog`;
  const servicesHref = localizePath("/services", routeLang);
  // Its call to action goes straight to the quote form.
  const contactHref = quoteFormHref(routeLang);
  const backToListLabel = translateWithFallback(t, "blogDetail.backToList", "← Vissza a bloghoz");
  const backToTopLabel = translateWithFallback(t, "blogDetail.backToTop", "↑ Oldal tetejére");
  const notFoundLabel = translateWithFallback(
    t,
    "blogDetail.notFound",
    "A keresett bejegyzés nem található."
  );
  const fetchErrorLabel = translateWithFallback(
    t,
    "blogDetail.fetchError",
    "A bejegyzés részletei most nem tölthetők be. Kérlek, próbáld meg később."
  );
  const blogLabel = translateWithFallback(t, "blogPage.label", "Blog");
  const languageNotice = translateWithFallback(
    t,
    "blogPage.languageNotice",
    "This blog is currently available only in Hungarian."
  );
  const showLanguageNotice = routeLang === "en" || routeLang === "de";
  const previousPostLabel = translateWithFallback(t, "blogDetail.previousPost", "← Előző cikk");
  const nextPostLabel = translateWithFallback(t, "blogDetail.nextPost", "Következő cikk →");
  const postNavigationLabel = translateWithFallback(
    t,
    "blogDetail.postNavigation",
    "Cikk navigáció"
  );
  const oldestPostLabel = translateWithFallback(t, "blogDetail.oldestPost", "Nincs korábbi cikk");
  const newestPostLabel = translateWithFallback(t, "blogDetail.newestPost", "Nincs frissebb cikk");

  if (data.notFound) {
    return (
      <section className="mx-auto w-full max-w-4xl px-6 pt-36 pb-16 sm:pt-40 sm:pb-20">
        <div className="rounded-3xl border border-dashed border-white/15 bg-white/3 p-8 text-center">
          <p className="text-base text-white/86">{notFoundLabel}</p>
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
          <p className="text-base text-white/86">{fetchErrorLabel}</p>
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
      : categoryKey === "dirtyFinancials"
        ? translateWithFallback(t, "blogPage.categories.dirtyFinancials", "Piszkos anyagiak")
        : translateWithFallback(t, "blogPage.categories.professional", "Szakmai");
  const createdAtLabel = formatDate(post.createdAt, locale);
  const previewImageUrl = getPostPreviewImageUrl(post.previewImageUrl);
  const postHref = `/${routeLang}/blog/${encodeURIComponent(post.id)}`;
  const shareActionLabel = translateWithFallback(t, "blogPage.share.action", "Megosztás");
  const shareCopyLabel = translateWithFallback(t, "blogPage.share.copy", "Link másolása");
  const shareCopiedLabel = translateWithFallback(t, "blogPage.share.copied", "Link másolva");
  const shareFallbackTitle = translateWithFallback(t, "blogPage.share.fallbackTitle", "Megosztás");
  const shareNativeHintLabel = translateWithFallback(
    t,
    "blogPage.share.nativeHint",
    "Instagram/Story opció mobilon a rendszer megosztóban érhető el."
  );

  return (
    <article
      id="blog-post-top"
      className="mx-auto w-full max-w-4xl px-6 pt-36 pb-16 sm:pt-40 sm:pb-20"
    >
      <a
        href={blogListHref}
        className="mb-6 inline-flex items-center text-sm font-semibold tracking-[0.04em] text-(--accent) transition hover:text-white"
      >
        {backToListLabel}
      </a>

      <header className="fancy-card overflow-hidden rounded-3xl">
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
            <p className="text-(--accent)">{blogLabel}</p>
            <span
              className={`rounded-full border px-3 py-1 ${getCategoryBadgeClassName(categoryKey)}`}
            >
              {categoryLabel}
            </span>
          </div>
          <h1 className="mt-3 text-3xl leading-tight font-semibold tracking-tight text-white sm:text-4xl">
            {post.title || t("blogPage.untitled")}
          </h1>
          {createdAtLabel ? <p className="mt-4 text-sm text-white/65">{createdAtLabel}</p> : null}
        </div>
      </header>

      {showLanguageNotice ? (
        <div
          className="mt-7 rounded-2xl border border-amber-300/40 bg-amber-500/10 px-5 py-4"
          role="status"
        >
          <p className="text-sm leading-7 font-medium text-amber-100 sm:text-base">
            {languageNotice}
          </p>
        </div>
      ) : null}

      <section className="mt-10 space-y-7">
        {post.sections.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 bg-white/3 p-6 text-center">
            <p className="text-base text-white/82">{t("blogDetail.emptySections")}</p>
          </div>
        ) : (
          post.sections.map((section, index) => (
            <section key={section.id} className="fancy-card rounded-2xl px-6 py-6 sm:px-8">
              <h2 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
                {section.subtitle || `${t("blogDetail.sectionFallbackTitle")} ${index + 1}`}
              </h2>
              {section.content ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                  {section.content}
                </ReactMarkdown>
              ) : (
                <p className="mt-4 text-base leading-8 text-white/84">
                  {t("blogDetail.sectionFallbackContent")}
                </p>
              )}
            </section>
          ))
        )}
      </section>

      <div className="fancy-card mt-10 rounded-3xl p-7 text-center sm:p-9">
        <h2 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
          {translateWithFallback(
            t,
            "blogDetail.ctaTitle",
            "Weboldal készítés, ami tényleg hoz ügyfeleket"
          )}
        </h2>
        <p className="mt-3 text-base leading-7 text-white/78">
          {translateWithFallback(
            t,
            "blogDetail.ctaText",
            "Ha hasonlóan átgondolt, gyors és SEO-barát weboldalra van szükséged, nézzük át közösen az igényeidet."
          )}
        </p>
        <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <ConversionCtaButton
            href={contactHref}
            onClick={() => trackEvent("quote_cta_click", { location: "blog_post" })}
          >
            {translateWithFallback(t, "blogDetail.ctaContactLabel", "Kérj ingyenes konzultációt")}
          </ConversionCtaButton>
          <a
            href={servicesHref}
            className="text-sm font-semibold tracking-[0.08em] text-(--accent) uppercase transition-colors hover:text-(--primary)"
          >
            {translateWithFallback(
              t,
              "blogDetail.ctaServicesLabel",
              "Nézd meg a weboldal készítés szolgáltatásaimat →"
            )}
          </a>
        </div>
      </div>

      {data.previousPost || data.nextPost ? (
        <nav aria-label={postNavigationLabel} className="mt-10 grid gap-4 sm:grid-cols-2">
          {data.previousPost ? (
            <a
              href={`/${routeLang}/blog/${encodeURIComponent(data.previousPost.id)}`}
              className="group fancy-card fancy-card-lift rounded-3xl px-5 py-5"
            >
              <span className="text-xs font-semibold tracking-[0.16em] text-white/50 uppercase">
                {previousPostLabel}
              </span>
              <span className="mt-2 block text-lg leading-snug font-semibold text-white transition group-hover:text-(--accent)">
                {data.previousPost.title || t("blogPage.untitled")}
              </span>
            </a>
          ) : (
            <div className="hidden px-5 py-5 sm:block">
              <span className="text-xs font-semibold tracking-[0.16em] text-white/35 uppercase">
                {oldestPostLabel}
              </span>
              <p className="mt-2 text-sm leading-6 text-white/45">
                {translateWithFallback(
                  t,
                  "blogDetail.oldestPostHint",
                  "Ez a blog első bejegyzése. A bloglistából bármikor vissza tudsz menni."
                )}
              </p>
            </div>
          )}

          {data.nextPost ? (
            <a
              href={`/${routeLang}/blog/${encodeURIComponent(data.nextPost.id)}`}
              className="group fancy-card fancy-card-lift rounded-3xl px-5 py-5 text-right"
            >
              <span className="text-xs font-semibold tracking-[0.16em] text-white/50 uppercase">
                {nextPostLabel}
              </span>
              <span className="mt-2 block text-lg leading-snug font-semibold text-white transition group-hover:text-(--accent)">
                {data.nextPost.title || t("blogPage.untitled")}
              </span>
            </a>
          ) : (
            <div className="hidden px-5 py-5 text-right sm:block">
              <span className="text-xs font-semibold tracking-[0.16em] text-white/35 uppercase">
                {newestPostLabel}
              </span>
              <p className="mt-2 text-sm leading-6 text-white/45">
                {translateWithFallback(
                  t,
                  "blogDetail.newestPostHint",
                  "Ez a legfrissebb bejegyzés. A bloglistából tovább böngészhetsz."
                )}
              </p>
            </div>
          )}
        </nav>
      ) : null}

      <div className="mt-10 flex flex-wrap items-center gap-3">
        <a
          href={blogListHref}
          className="inline-flex items-center rounded-full border border-(--accent)/55 bg-(--accent)/15 px-5 py-2 text-sm font-semibold tracking-[0.04em] text-(--accent) transition hover:border-(--accent)/75 hover:bg-(--accent)/24"
        >
          {backToListLabel}
        </a>
        <SharePostButton
          url={postHref}
          title={post.title || t("blogPage.untitled")}
          text={post.description || ""}
          actionLabel={shareActionLabel}
          copyLabel={shareCopyLabel}
          copiedLabel={shareCopiedLabel}
          fallbackTitle={shareFallbackTitle}
          nativeHintLabel={shareNativeHintLabel}
          className="inline-flex items-center rounded-full border border-white/20 bg-white/6 px-5 py-2 text-sm font-semibold tracking-[0.04em] text-white/86 transition hover:border-white/35 hover:bg-white/10"
        />
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
