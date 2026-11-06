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
  "/projects": { en: "projects", hu: "projektek", de: "projekte" },
  "/blog": { en: "blog", hu: "blog", de: "blog" },
  "/technology": { en: "technology", hu: "technologia", de: "technologie" },
  "/contact": { en: "contact", hu: "kapcsolat", de: "kontakt" },
};
const KNOWN_LOGICAL_PATHS = [
  "/",
  "/about",
  "/services",
  "/projects",
  "/blog",
  "/technology",
  "/contact",
];

// Hungarian-only legal pages: not localized, no language prefix, no
// cross-language siblings — so no hreflang block for these.
const LEGAL_PATHS = ["/adatkezeles", "/impresszum", "/aszf"];

const PROD_API_BASE_URL = "https://synelweb.fly.dev";
const SITE_URL = (process.env.VITE_SITE_URL || "https://synelweb.hu").replace(/\/+$/, "");
const TODAY = new Date().toISOString().slice(0, 10);

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

async function fetchBlogPostIds(lang) {
  try {
    const response = await fetch(`${resolveApiBaseUrl()}/blog/blogposts/`, {
      headers: { "Accept-Language": lang },
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) return [];

    const data = await response.json();
    if (!Array.isArray(data)) return [];

    return data
      .map((item) => (item?.id === undefined || item?.id === null ? "" : String(item.id).trim()))
      .filter(Boolean);
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

  const blogPostIdsByLang = Object.fromEntries(
    await Promise.all(SUPPORTED_LANGS.map(async (lang) => [lang, await fetchBlogPostIds(lang)]))
  );
  // Only the default language's post list decides which posts exist; the
  // backend returns the same set of ids for every language (just with
  // translated content where available), so this avoids duplicate/partial
  // groups if one language's response is briefly inconsistent.
  for (const id of blogPostIdsByLang[DEFAULT_LANG]) {
    addLocalizedGroup(groups, `/blog/${id}`);
  }

  const seen = new Set();
  const entries = [];
  for (const group of groups) {
    if (seen.has(group.path)) continue;
    seen.add(group.path);
    entries.push(group);
  }

  for (const legalPath of LEGAL_PATHS) {
    entries.push({ path: legalPath, alternates: null });
  }

  return entries;
}

function toXml(entries) {
  const urlBlocks = entries.map(({ path, alternates }) => {
    const lines = [`    <loc>${SITE_URL}${path}</loc>`, `    <lastmod>${TODAY}</lastmod>`];

    if (alternates) {
      for (const lang of SUPPORTED_LANGS) {
        lines.push(
          `    <xhtml:link rel="alternate" hreflang="${lang}" href="${SITE_URL}${alternates[lang]}" />`
        );
      }
      lines.push(
        `    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}${alternates[DEFAULT_LANG]}" />`
      );
    }

    return `  <url>\n${lines.join("\n")}\n  </url>`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urlBlocks.join("\n")}\n</urlset>\n`;
}

const entries = await buildEntries();
writeFileSync(join(process.cwd(), "public", "sitemap.xml"), toXml(entries));
console.log(`sitemap.xml: wrote ${entries.length} URLs`);
