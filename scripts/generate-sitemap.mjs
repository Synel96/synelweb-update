import { writeFileSync } from "node:fs";
import { join } from "node:path";

// Keep this map in sync with LOCALIZED_SEGMENTS in src/localizedRoutes.ts —
// duplicated here because this script runs as plain Node outside the
// TS/Vite build, before `vike build` copies public/ into the output.
const SUPPORTED_LANGS = ["hu", "en", "de"];
const DEFAULT_LANG = "hu";
const LOCALIZED_SEGMENTS = {
  "/about": { en: "about", hu: "rolam", de: "ueber-mich" },
  "/services": { en: "services", hu: "szolgaltatasok", de: "dienstleistungen" },
  "/google-ads": {
    en: "google-ads-management",
    hu: "google-ads-kezeles",
    de: "google-ads-betreuung",
  },
  "/site-check": { en: "website-check", hu: "weboldal-ellenorzes", de: "website-check" },
  "/projects": { en: "projects", hu: "projektek", de: "projekte" },
  "/certificates": { en: "certificates", hu: "tanusitvanyok", de: "zertifikate" },
  "/blog": { en: "blog", hu: "blog", de: "blog" },
  "/technology": { en: "technology", hu: "technologia", de: "technologie" },
  "/contact": { en: "contact", hu: "kapcsolat", de: "kontakt" },
};
const KNOWN_LOGICAL_PATHS = [
  "/",
  "/about",
  "/services",
  "/google-ads",
  "/site-check",
  "/projects",
  "/certificates",
  "/blog",
  "/technology",
  "/contact",
];

// Regional landing pages: one language each, no translations — keep in sync
// with REGIONAL_PAGES in src/localizedRoutes.ts. Each lists only itself as an
// hreflang alternate.
const REGIONAL_PATHS = [
  { lang: "hu", path: "/hu/weboldal-keszites-sopron" },
  { lang: "de", path: "/de/webdesign-burgenland-wien" },
];

// Hungarian-only legal pages: not localized, no language prefix, no
// cross-language siblings — so no hreflang block for these.
const LEGAL_PATHS = ["/adatkezeles", "/impresszum", "/aszf"];

const PROD_API_BASE_URL = "https://synelweb.fly.dev";
const SITE_URL = (process.env.VITE_SITE_URL || "https://synelweb.hu").replace(/\/+$/, "");

function resolveApiBaseUrl() {
  const configured = (process.env.VITE_API_BASE_URL || "").trim();
  if (!configured || configured.includes("127.0.0.1") || configured.includes("localhost")) {
    return PROD_API_BASE_URL;
  }
  return configured;
}

function localizePath(logicalPath, lang) {
  if (logicalPath === "/") return `/${lang}/`;
  const segment = LOCALIZED_SEGMENTS[logicalPath]?.[lang];
  return segment ? `/${lang}/${segment}` : `/${lang}${logicalPath}`;
}

// A "group" is one logical page's set of per-language URLs — each entry in
// the sitemap links back to every other language version via hreflang, plus
// x-default pointing at the Hungarian (default-language) version.
function addLocalizedGroup(groups, logicalPath) {
  const byLang = Object.fromEntries(
    SUPPORTED_LANGS.map((lang) => [lang, localizePath(logicalPath, lang)])
  );
  for (const lang of SUPPORTED_LANGS) {
    groups.push({ path: byLang[lang], alternates: byLang });
  }
}

// Each post's address key (its slug, or the id if it has none) and the day
// it last changed.
async function fetchBlogPosts() {
  try {
    const response = await fetch(`${resolveApiBaseUrl()}/blog/blogposts/`, {
      headers: { "Accept-Language": DEFAULT_LANG },
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) return [];

    const data = await response.json();
    if (!Array.isArray(data)) return [];

    return data
      .map((item) => {
        const slug = typeof item?.slug === "string" ? item.slug.trim() : "";
        const id = item?.id === undefined || item?.id === null ? "" : String(item.id).trim();
        const changed = String(item?.updated_at ?? item?.created_at ?? "").slice(0, 10);
        const listed = Array.isArray(item?.translations) ? item.translations : [];
        return {
          key: slug || id,
          lastmod: /^\d{4}-\d{2}-\d{2}$/.test(changed) ? changed : null,
          // Hungarian always; English / German when the post is translated.
          langs: SUPPORTED_LANGS.filter((lang) => lang === DEFAULT_LANG || listed.includes(lang)),
        };
      })
      .filter((post) => post.key);
  } catch {
    // Keep the build resilient if the blog API is unreachable at build time
    // — the next build picks up any posts missed this time.
    return [];
  }
}

async function buildEntries() {
  const groups = [];

  for (const logicalPath of KNOWN_LOGICAL_PATHS) {
    addLocalizedGroup(groups, logicalPath);
  }

  const blogPosts = await fetchBlogPosts();

  const seen = new Set();
  const entries = [];
  for (const group of groups) {
    if (seen.has(group.path)) continue;
    seen.add(group.path);
    entries.push(group);
  }

  for (const { lang, path } of REGIONAL_PATHS) {
    entries.push({ path, alternates: null, selfLang: lang });
  }

  // A blog post is listed in the languages it is translated into. In any
  // other language the page shows the Hungarian text and is canonical to the
  // Hungarian URL, so it is left out.
  for (const post of blogPosts) {
    const logicalPath = `/blog/${encodeURIComponent(post.key)}`;
    const byLang = Object.fromEntries(
      post.langs.map((lang) => [lang, localizePath(logicalPath, lang)])
    );
    for (const lang of post.langs) {
      entries.push({
        path: byLang[lang],
        alternates: post.langs.length > 1 ? byLang : null,
        selfLang: post.langs.length > 1 ? null : lang,
        lastmod: post.lastmod,
      });
    }
  }

  for (const legalPath of LEGAL_PATHS) {
    entries.push({ path: legalPath, alternates: null });
  }

  return entries;
}

function toXml(entries) {
  // <lastmod> only where the real date is known (blog posts). Stamping every
  // page with the build date told search engines that everything changed on
  // every deploy, which makes them ignore the field.
  const urlBlocks = entries.map(({ path, alternates, selfLang, lastmod }) => {
    const lines = [`    <loc>${SITE_URL}${path}</loc>`];
    if (lastmod) lines.push(`    <lastmod>${lastmod}</lastmod>`);

    if (alternates) {
      for (const lang of SUPPORTED_LANGS) {
        if (!alternates[lang]) continue;
        lines.push(
          `    <xhtml:link rel="alternate" hreflang="${lang}" href="${SITE_URL}${alternates[lang]}" />`
        );
      }
      lines.push(
        `    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}${alternates[DEFAULT_LANG]}" />`
      );
    }

    if (selfLang) {
      lines.push(
        `    <xhtml:link rel="alternate" hreflang="${selfLang}" href="${SITE_URL}${path}" />`
      );
    }

    return `  <url>\n${lines.join("\n")}\n  </url>`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urlBlocks.join("\n")}\n</urlset>\n`;
}

const entries = await buildEntries();
writeFileSync(join(process.cwd(), "public", "sitemap.xml"), toXml(entries));
console.log(`sitemap.xml: wrote ${entries.length} URLs`);
