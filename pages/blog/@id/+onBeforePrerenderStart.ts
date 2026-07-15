import { SUPPORTED_LANGS } from "@/src/i18n-config";
import { localizePath } from "@/src/localizedRoutes";
import { getBlogPosts } from "@/src/services/blogPostsService";
import type { AppLang } from "@/src/services/serviceCardsService";

function toAppLang(language: string): AppLang {
  const normalized = language.toLowerCase();
  if (normalized.startsWith("hu")) return "hu";
  if (normalized.startsWith("de")) return "de";
  return "en";
}

export async function onBeforePrerenderStart() {
  const routes = new Set<string>();

  for (const lang of SUPPORTED_LANGS) {
    const appLang = toAppLang(lang);

    try {
      const posts = await getBlogPosts(appLang);

      for (const post of posts) {
        const id = post.id.trim();
        if (!id) continue;

        const logicalPath = `/blog/${encodeURIComponent(id)}`;
        routes.add(logicalPath);
        routes.add(localizePath(logicalPath, lang));
      }
    } catch {
      // Keep build resilient if blog API is temporarily unavailable.
    }
  }

  return Array.from(routes);
}
