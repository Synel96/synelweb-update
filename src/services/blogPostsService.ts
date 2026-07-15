import { env } from "@/src/env";
import type { AppLang } from "./serviceCardsService";

type ApiBlogPost = {
  id?: string | number;
  title?: string;
  description?: string;
  preview_image_url?: string | null;
  category?: string;
  created_at?: string;
};

export type BlogPost = {
  id: string;
  title: string;
  description: string;
  previewImageUrl: string;
  category: string;
  createdAt: string;
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

export async function getBlogPosts(lang: AppLang): Promise<BlogPost[]> {
  const response = await fetch(BLOG_POSTS_ENDPOINT, {
    headers: {
      "Accept-Language": lang,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch blog posts.");
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