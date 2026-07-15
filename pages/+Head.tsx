// https://vike.dev/Head

import "./Layout.css";
import geistFontUrl from "@fontsource-variable/geist/files/geist-latin-wght-normal.woff2?url";
import { usePageContext } from "vike-react/usePageContext";
import { SITE_URL, BRAND_NAME } from "../components/site";
import { buildMeta } from "../src/seo";
import { DEFAULT_LANG, type SupportedLang } from "../src/i18n-config";
import { resolveLanguageAndLogicalPath } from "../src/localizedRoutes";

const HERO_VIDEO_POSTER_URL =
  "https://res.cloudinary.com/dmwulp3dl/image/upload/f_auto,q_auto:low,w_960,c_limit,dpr_auto/v1784120435/coverr-temp-sftfwatermarkedvideo00436be495bc341e4b7274f83a560daa2mp4-5896-1080p_1__exported_0_dkidt5.webp";

export function Head() {
  const pageContext = usePageContext() as {
    urlPathname: string;
    lang?: SupportedLang;
  };
  const lang = pageContext.lang ?? DEFAULT_LANG;
  const meta = buildMeta({
    pathname: pageContext.urlPathname,
    lang,
  });
  const { logicalPath } = resolveLanguageAndLogicalPath(pageContext.urlPathname);
  const isHomePage = logicalPath === "/";
  const organizationLogoUrl = new URL("/sw-favicon.svg", SITE_URL).toString();

  return (
    <>
      <meta name="google" content="notranslate" />
      <link rel="icon" type="image/svg+xml" href="/sw-favicon.svg" />
      <link rel="dns-prefetch" href="https://res.cloudinary.com" />
      <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
      {isHomePage ? (
        <link rel="preload" as="image" href={HERO_VIDEO_POSTER_URL} fetchPriority="high" />
      ) : null}
      <link rel="canonical" href={meta.canonicalUrl} />

      {/* hreflang alternates — tells Google which URL serves which language */}
      {meta.alternates.map((alt) => (
        <link key={alt.hreflang} rel="alternate" hrefLang={alt.hreflang} href={alt.href} />
      ))}

      {/* Open Graph / Social Media */}
      <meta property="og:type" content="website" />
      <meta property="og:locale" content={lang} />
      <meta property="og:url" content={meta.canonicalUrl} />
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
