import { env } from "@/src/env";
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
  preview_image_url?: string | null;
  category?: string;
  created_at?: string;
  sections?: ApiBlogSection[];
};

export type BlogPost = {
  id: string;
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
  title: string;
  previewImageUrl: string;
  category: string;
  createdAt: string;
  sections: BlogPostSection[];
};

const DEFAULT_PROD_API_BASE_URL = "https://synelweb.fly.dev";

function resolveApiBaseUrl() {
  const configured = env.VITE_API_BASE_URL.trim();

  if (
    import.meta.env.PROD &&
    (configured.includes("127.0.0.1") || configured.includes("localhost"))
  ) {
    return DEFAULT_PROD_API_BASE_URL;
  }

  return configured;
}

const BLOG_POSTS_ENDPOINT = `${resolveApiBaseUrl()}/blog/blogposts/`;

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
  const response = await fetch(BLOG_POSTS_ENDPOINT, {
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

    return {
      id: apiId || `${title || "blog-post"}-${createdAt || "date"}-${index}`,
      title,
      description: normalizeText(item.description),
      previewImageUrl: normalizeImageUrl(item.preview_image_url),
      category: normalizeText(item.category),
      createdAt,
    };
  });
}

export async function getBlogPostDetail(id: string, lang: AppLang): Promise<BlogPostDetail> {
  const normalizedId = normalizeId(id);
  if (!normalizedId) {
    throw new Error("Blog post ID is required.");
  }

  const response = await fetch(`${BLOG_POSTS_ENDPOINT}${encodeURIComponent(normalizedId)}/`, {
    headers: {
      "Accept-Language": lang,
    },
  });

  if (!response.ok) {
    throw new BlogApiError("Failed to fetch blog post detail.", response.status);
  }

  const data = (await response.json()) as ApiBlogPostDetail;
  const resolvedId = normalizeId(data.id) || normalizedId;
  const sections = Array.isArray(data.sections) ? data.sections : [];

  return {
    id: resolvedId,
    title: normalizeText(data.title),
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