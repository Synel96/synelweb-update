import { env } from "@/src/env";
import type { AppLang } from "./serviceCardsService";

type ApiBlogPost = {
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

const BLOG_POSTS_ENDPOINT = `${env.VITE_API_BASE_URL}/blog/blogposts/`;

function normalizeText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeImageUrl(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
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
    const title = normalizeText(item.title);
    const createdAt = normalizeText(item.created_at);

    return {
      id: `${title || "blog-post"}-${createdAt || index}`,
      title,
      description: normalizeText(item.description),
      previewImageUrl: normalizeImageUrl(item.preview_image_url),
      category: normalizeText(item.category),
      createdAt,
    };
  });
}