import { env } from "@/src/env";

const CLOUDINARY_VIDEO_UPLOAD_BASE = `https://res.cloudinary.com/${env.VITE_CLOUDINARY_CLOUD_NAME}/video/upload/`;
const CLOUDINARY_IMAGE_UPLOAD_BASE = `https://res.cloudinary.com/${env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload/`;
const CLOUDINARY_IMAGE_UPLOAD_SEGMENT = "/image/upload/";

function isVersionSegment(segment: string) {
  return /^v\d+$/.test(segment);
}

function splitCloudinaryImageUrl(url: string) {
  const trimmed = url.trim();
  const uploadIndex = trimmed.indexOf(CLOUDINARY_IMAGE_UPLOAD_SEGMENT);
  if (uploadIndex === -1) return null;

  const prefixEnd = uploadIndex + CLOUDINARY_IMAGE_UPLOAD_SEGMENT.length;
  const prefix = trimmed.slice(0, prefixEnd);
  const remainder = trimmed.slice(prefixEnd);
  return { prefix, remainder };
}

function transformationKey(part: string) {
  const separatorIndex = part.indexOf("_");
  return separatorIndex === -1 ? part : part.slice(0, separatorIndex);
}

function mergeTransformations(existing: string[], incoming: string[]) {
  const next = [...existing];
  for (const value of incoming) {
    const key = transformationKey(value);
    for (let index = next.length - 1; index >= 0; index--) {
      if (transformationKey(next[index]) === key) {
        next.splice(index, 1);
      }
    }
    next.push(value);
  }
  return next;
}

function withCloudinaryTransformations(url: string, transformations: string[]) {
  const split = splitCloudinaryImageUrl(url);
  if (!split) return url.trim();

  const { prefix, remainder } = split;
  if (!remainder) return url.trim();

  const firstSlashIndex = remainder.indexOf("/");
  if (firstSlashIndex === -1) {
    return `${prefix}${transformations.join(",")}/${remainder}`;
  }

  const firstSegment = remainder.slice(0, firstSlashIndex);
  const rest = remainder.slice(firstSlashIndex + 1);

  if (isVersionSegment(firstSegment)) {
    return `${prefix}${transformations.join(",")}/${remainder}`;
  }

  const existing = firstSegment.split(",").filter(Boolean);
  const merged = mergeTransformations(existing, transformations);
  return `${prefix}${merged.join(",")}/${rest}`;
}

export function cloudinaryVideoUrl(uploadPath: string) {
  const normalized = uploadPath.replace(/^\/+/, "");
  return new URL(normalized, CLOUDINARY_VIDEO_UPLOAD_BASE).toString();
}

export function cloudinaryImageUrl(uploadPath: string) {
  const normalized = uploadPath.replace(/^\/+/, "");
  return new URL(`f_auto,q_auto/${normalized}`, CLOUDINARY_IMAGE_UPLOAD_BASE).toString();
}

export function isCloudinaryImageUrl(url: string): boolean {
  return splitCloudinaryImageUrl(url) !== null;
}

export function cloudinarySizedImageUrl(url: string, width: number, aspectRatio = 16 / 10): string {
  const safeWidth = Math.max(240, Math.round(width));
  const height = Math.max(150, Math.round(safeWidth / aspectRatio));
  return withCloudinaryTransformations(url, [
    "c_fill",
    "g_auto",
    `w_${safeWidth}`,
    `h_${height}`,
    "dpr_auto",
    "f_auto",
    "q_auto",
  ]);
}

export function withCloudinaryAutoParams(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return "";
  return withCloudinaryTransformations(trimmed, ["f_auto", "q_auto"]);
}
