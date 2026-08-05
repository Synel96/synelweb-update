// https://vike.dev/Head

import "./Layout.css";
import geistFontUrl from "@fontsource-variable/geist/files/geist-latin-wght-normal.woff2?url";
import { usePageContext } from "vike-react/usePageContext";
import { SITE_URL } from "../components/site";
import { buildMeta } from "../src/seo";
import { DEFAULT_LANG, type SupportedLang } from "../src/i18n-config";
import { localizePath, normalizeLogicalPath } from "../src/localizedRoutes";
import {
  BREADCRUMB_LABELS,
  buildBlogPostingJsonLd,
  buildBreadcrumbJsonLd,
  buildOrganizationJsonLd,
  isKnownLogicalPath,
  type BreadcrumbItem,
} from "../src/structuredData";
import { withCloudinaryAutoParams } from "@/src/cloudinary";

type BlogDetailData = {
  post?: {
    title?: string;
    description?: string;
    previewImageUrl?: string;
    createdAt?: string;
  } | null;
};

function toAbsoluteUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return "";

  try {
    return new URL(trimmed, SITE_URL).toString();
  } catch {
    return "";
  }
}

export function Head() {
  const pageContext = usePageContext() as {
    urlPathname: string;
    lang?: SupportedLang;
    data?: BlogDetailData;
  };
  const lang = pageContext.lang ?? DEFAULT_LANG;
  const postTitle = pageContext.data?.post?.title?.trim() ?? "";
  const postDescription = pageContext.data?.post?.description?.trim() ?? "";
  const postPreviewImage = pageContext.data?.post?.previewImageUrl?.trim() ?? "";
  const postCreatedAt = pageContext.data?.post?.createdAt?.trim() ?? "";
  const resolvedPostImage = postPreviewImage
    ? toAbsoluteUrl(withCloudinaryAutoParams(postPreviewImage))
    : "";
  const meta = buildMeta({
    pathname: pageContext.urlPathname,
    lang,
    title: postTitle || null,
    description: postDescription || null,
    image: resolvedPostImage || null,
  });

  const logicalPath = normalizeLogicalPath(pageContext.urlPathname);
  const isBlogPostPage = logicalPath.startsWith("/blog/") && logicalPath.length > "/blog/".length;
  const homeItem: BreadcrumbItem = {
    name: BREADCRUMB_LABELS[lang]["/"],
    url: new URL(localizePath("/", lang), SITE_URL).toString(),
  };

  let breadcrumbItems: BreadcrumbItem[] | null = null;
  if (isBlogPostPage && postTitle) {
    breadcrumbItems = [
      homeItem,
      {
        name: BREADCRUMB_LABELS[lang]["/blog"],
        url: new URL(localizePath("/blog", lang), SITE_URL).toString(),
      },
      { name: postTitle, url: meta.canonicalUrl },
    ];
  } else if (logicalPath !== "/" && isKnownLogicalPath(logicalPath)) {
    breadcrumbItems = [
      homeItem,
      { name: BREADCRUMB_LABELS[lang][logicalPath], url: meta.canonicalUrl },
    ];
  }

  const blogPostingJsonLd =
    isBlogPostPage && postTitle
      ? buildBlogPostingJsonLd({
          url: meta.canonicalUrl,
          title: postTitle,
          description: postDescription,
          image: resolvedPostImage,
          datePublished: postCreatedAt,
        })
      : null;

  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `(() => {
  if (!Array.prototype.at) {
    Object.defineProperty(Array.prototype, "at", {
      value: function (n) {
        const len = this.length >>> 0;
        let index = Number(n) || 0;
        if (index < 0) index += len;
        if (index < 0 || index >= len) return undefined;
        return this[index];
      },
      writable: true,
      enumerable: false,
      configurable: true
    });
  }

  if (!String.prototype.at) {
    Object.defineProperty(String.prototype, "at", {
      value: function (n) {
        const s = String(this);
        const len = s.length;
        let index = Number(n) || 0;
        if (index < 0) index += len;
        if (index < 0 || index >= len) return undefined;
        return s.charAt(index);
      },
      writable: true,
      enumerable: false,
      configurable: true
    });
  }
})();`,
        }}
      />
      <meta name="google" content="notranslate" />
      <link rel="icon" type="image/svg+xml" href="/sw-favicon.svg" />
      <link rel="dns-prefetch" href="https://res.cloudinary.com" />
      <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
      <link rel="canonical" href={meta.canonicalUrl} />

      {/* hreflang alternates — tells Google which URL serves which language */}
      {meta.alternates.map((alt) => (
        <link key={alt.hreflang} rel="alternate" hrefLang={alt.hreflang} href={alt.href} />
      ))}

      {/* Open Graph / Social Media */}
      <meta property="og:type" content="website" />
      <meta property="og:locale" content={lang} />
      <meta property="og:url" content={meta.canonicalUrl} />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:image" content={meta.image} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={meta.canonicalUrl} />
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.description} />
      <meta name="twitter:image" content={meta.image} />

      {/* JSON-LD Schema.org */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildOrganizationJsonLd()) }}
      />

      {breadcrumbItems ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(buildBreadcrumbJsonLd(breadcrumbItems)),
          }}
        />
      ) : null}

      {blogPostingJsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingJsonLd) }}
        />
      ) : null}

      {/* Preload the primary (Latin) font — high priority to unblock LCP */}
      <link
        rel="preload"
        href={geistFontUrl}
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
        fetchPriority="high"
      />
    </>
  );
}
