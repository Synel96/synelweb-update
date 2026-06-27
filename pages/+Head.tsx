// https://vike.dev/Head

import geistFontUrl from "@fontsource-variable/geist/files/geist-latin-wght-normal.woff2?url";
import logoUrl from "../assets/logo.svg";
import { usePageContext } from "vike-react/usePageContext";
import { SITE_URL, BRAND_NAME } from "../components/site";
import { buildMeta } from "../src/seo";
import { DEFAULT_LANG, type SupportedLang } from "../src/i18n-config";

export function Head() {
  const pageContext = usePageContext() as {
    urlPathname: string;
    lang?: SupportedLang;
    config?: {
      title?: string;
      description?: string;
    };
  };
  const lang = pageContext.lang ?? DEFAULT_LANG;
  const meta = buildMeta({
    pathname: pageContext.urlPathname,
    lang,
    title: pageContext.config?.title,
    description: pageContext.config?.description,
  });
  const organizationLogoUrl = new URL(logoUrl, SITE_URL).toString();

  return (
    <>
      <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'/%3E" />
      <link rel="canonical" href={meta.canonicalUrl} />

      {/* hreflang alternates — tells Google which URL serves which language */}
      {meta.alternates.map((alt) => (
        <link key={alt.hreflang} rel="alternate" hrefLang={alt.hreflang} href={alt.href} />
      ))}

      {/* Open Graph / Social Media */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={meta.canonicalUrl} />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:image" content={meta.image} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={meta.canonicalUrl} />
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.description} />
      <meta name="twitter:image" content={meta.image} />

      {/* JSON-LD Schema.org (Placeholder) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: BRAND_NAME,
            url: SITE_URL,
            logo: organizationLogoUrl,
          }),
        }}
      />

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
