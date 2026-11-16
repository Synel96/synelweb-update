import { resolveApiBaseUrl } from "@/src/apiBaseUrl";
import { fetchWithTimeout } from "@/src/fetchWithTimeout";
import type { AppLang } from "./serviceCardsService";

export class BlogApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "BlogApiError";
    this.status = status;
  }
}

type ApiBlogPost = {
  id?: string | number;
  title?: string;
  description?: string;
  preview_image_url?: string | null;
  category?: string;
  created_at?: string;
  slug?: string;
  updated_at?: string;
  language?: string;
  translations?: string[];
};

type ApiBlogSection = {
  id?: string | number;
  subtitle?: string;
  content?: string;
  order?: number;
};

type ApiBlogPostDetail = {
  id?: string | number;
  title?: string;
  description?: string;
  preview_image_url?: string | null;
  category?: string;
  created_at?: string;
  slug?: string;
  updated_at?: string;
  language?: string;
  translations?: string[];
  sections?: ApiBlogSection[];
};

export type BlogPost = {
  id: string;
  // What the post's address ends in: its slug, or the id if it has none.
  urlKey: string;
  updatedAt: string;
  // The language the texts are in: the page's language when the post is
  // translated into it, Hungarian otherwise.
  language: AppLang;
  // Every language the post exists in (always includes Hungarian).
  translations: AppLang[];
  title: string;
  description: string;
  previewImageUrl: string;
  category: string;
  createdAt: string;
};

export type BlogPostSection = {
  id: string;
  subtitle: string;
  content: string;
  order: number;
};

export type BlogPostDetail = {
  id: string;
  urlKey: string;
  updatedAt: string;
  // The language the texts are in: the page's language when the post is
  // translated into it, Hungarian otherwise.
  language: AppLang;
  // Every language the post exists in (always includes Hungarian).
  translations: AppLang[];
  title: string;
  description: string;
  previewImageUrl: string;
  category: string;
  createdAt: string;
  sections: BlogPostSection[];
};

const BLOG_POSTS_ENDPOINT = `${resolveApiBaseUrl()}/blog/blogposts/`;

const POST_LANGS: readonly AppLang[] = ["hu", "en", "de"];

function normalizeLanguage(value: unknown): AppLang {
  return POST_LANGS.includes(value as AppLang) ? (value as AppLang) : "hu";
}

function normalizeTranslations(value: unknown): AppLang[] {
  const listed = Array.isArray(value) ? POST_LANGS.filter((lang) => value.includes(lang)) : [];
  return listed.includes("hu") ? listed : ["hu", ...listed];
}

function normalizeText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeImageUrl(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeId(value: unknown): string {
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  if (typeof value === "string") return value.trim();
  return "";
}

function normalizeOrder(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  return Number.MAX_SAFE_INTEGER;
}

export async function getBlogPosts(lang: AppLang): Promise<BlogPost[]> {
  const response = await fetchWithTimeout(BLOG_POSTS_ENDPOINT, {
    headers: {
      "Accept-Language": lang,
    },
  });

  if (!response.ok) {
    throw new BlogApiError("Failed to fetch blog posts.", response.status);
  }

  const data = (await response.json()) as ApiBlogPost[];

  return data.map((item, index) => {
    const apiId = normalizeId(item.id);
    const title = normalizeText(item.title);
    const createdAt = normalizeText(item.created_at);

    const id = apiId || `${title || "blog-post"}-${createdAt || "date"}-${index}`;

    return {
      id,
      urlKey: normalizeText(item.slug) || id,
      updatedAt: normalizeText(item.updated_at),
      language: normalizeLanguage(item.language),
      translations: normalizeTranslations(item.translations),
      title,
      description: normalizeText(item.description),
      previewImageUrl: normalizeImageUrl(item.preview_image_url),
      category: normalizeText(item.category),
      createdAt,
    };
  });
}

// `id` is a post id or its slug: the API answers to both.
export async function getBlogPostDetail(id: string, lang: AppLang): Promise<BlogPostDetail> {
  const normalizedId = normalizeId(id);
  if (!normalizedId) {
    throw new Error("Blog post ID is required.");
  }

  const response = await fetchWithTimeout(
    `${BLOG_POSTS_ENDPOINT}${encodeURIComponent(normalizedId)}/`,
    {
      headers: {
        "Accept-Language": lang,
      },
    }
  );

  if (!response.ok) {
    throw new BlogApiError("Failed to fetch blog post detail.", response.status);
  }

  const data = (await response.json()) as ApiBlogPostDetail;
  const resolvedId = normalizeId(data.id) || normalizedId;
  const sections = Array.isArray(data.sections) ? data.sections : [];

  return {
    id: resolvedId,
    urlKey: normalizeText(data.slug) || resolvedId,
    updatedAt: normalizeText(data.updated_at),
    language: normalizeLanguage(data.language),
    translations: normalizeTranslations(data.translations),
    title: normalizeText(data.title),
    description: normalizeText(data.description),
    previewImageUrl: normalizeImageUrl(data.preview_image_url),
    category: normalizeText(data.category),
    createdAt: normalizeText(data.created_at),
    sections: sections
      .map((section, index) => {
        const sectionId = normalizeId(section.id);
        return {
          id: sectionId || `${resolvedId}-section-${index + 1}`,
          subtitle: normalizeText(section.subtitle),
          content: normalizeText(section.content),
          order: normalizeOrder(section.order),
        };
      })
      .sort((a, b) => a.order - b.order),
  };
}
