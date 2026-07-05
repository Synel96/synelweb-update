import type { AppLang } from "./serviceCardsService";
import { cloudinaryImageUrl, withCloudinaryAutoParams } from "@/src/cloudinary";

type LocalizedText = {
  hu?: string;
  en?: string;
  de?: string;
};

type ScoreItem = {
  label: string;
  value: number;
};

type ProjectStackItem = {
  name: string;
  logo: string;
};

type ApiProject = {
  id: string | number;
  name: string;
  stack?: ProjectStackItem[];
  description?: LocalizedText;
  lighthouseMobile?: ScoreItem[];
  lighthouseDesktop?: ScoreItem[];
  liveUrl?: string;
  isActive?: boolean;
  order?: number;
  images?: string[];
  previewImage?: string;
  preview_image?: string;
  previewImageUrl?: string;
  preview_image_url?: string;
  image?: string;
  imageUrl?: string;
  cloudinaryUrl?: string;
};

export type Project = {
  id: string;
  name: string;
  stack: ProjectStackItem[];
  description: string;
  mobileScores: ScoreItem[];
  desktopScores: ScoreItem[];
  liveUrl: string;
  previewImage: string;
  otherImages: string[];
  order: number;
};

const API_BASE_URL = "https://synelweb.fly.dev";
const PROJECTS_ENDPOINT = `${API_BASE_URL}/api/projects/`;

function pickLocalized(text: LocalizedText | undefined, lang: AppLang): string {
  if (!text) return "";
  const candidate = text[lang] ?? text.hu ?? text.en ?? text.de ?? "";
  return candidate.trim();
}

function normalizeImageUrl(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";

  const isAbsoluteUrl = /^https?:\/\//i.test(trimmed);
  if (isAbsoluteUrl) {
    return withCloudinaryAutoParams(trimmed);
  }

  return cloudinaryImageUrl(trimmed);
}

function resolveProjectImages(item: ApiProject): string[] {
  const candidates = [
    ...(Array.isArray(item.images) ? item.images : []),
    item.previewImage,
    item.preview_image,
    item.previewImageUrl,
    item.preview_image_url,
    item.image,
    item.imageUrl,
    item.cloudinaryUrl,
  ];

  const unique = new Set<string>();
  for (const candidate of candidates) {
    if (typeof candidate !== "string") continue;
    const normalized = normalizeImageUrl(candidate);
    if (!normalized) continue;
    unique.add(normalized);
  }

  return Array.from(unique);
}

export async function getProjects(lang: AppLang): Promise<Project[]> {
  const response = await fetch(PROJECTS_ENDPOINT, {
    headers: {
      "Accept-Language": lang,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch projects.");
  }

  const data = (await response.json()) as ApiProject[];

  return data
    .filter((item) => item.isActive !== false)
    .map((item) => {
      const images = resolveProjectImages(item);
      return {
        id: String(item.id),
        name: item.name,
        stack: Array.isArray(item.stack) ? item.stack : [],
        description: pickLocalized(item.description, lang),
        mobileScores: Array.isArray(item.lighthouseMobile) ? item.lighthouseMobile : [],
        desktopScores: Array.isArray(item.lighthouseDesktop) ? item.lighthouseDesktop : [],
        liveUrl: (item.liveUrl || "").trim(),
        previewImage: images[0] || "",
        otherImages: images.slice(1),
        order: typeof item.order === "number" ? item.order : Number(item.id) || 0,
      };
    })
    .sort((a, b) => a.order - b.order);
}
