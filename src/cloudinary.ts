import { env } from "@/src/env";

const CLOUDINARY_VIDEO_UPLOAD_BASE = `https://res.cloudinary.com/${env.VITE_CLOUDINARY_CLOUD_NAME}/video/upload/`;
const CLOUDINARY_IMAGE_UPLOAD_BASE = `https://res.cloudinary.com/${env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload/`;
const CLOUDINARY_IMAGE_UPLOAD_SEGMENT = "/image/upload/";

export function cloudinaryVideoUrl(uploadPath: string) {
  const normalized = uploadPath.replace(/^\/+/, "");
  return new URL(normalized, CLOUDINARY_VIDEO_UPLOAD_BASE).toString();
}

export function cloudinaryImageUrl(uploadPath: string) {
  const normalized = uploadPath.replace(/^\/+/, "");
  return new URL(`f_auto,q_auto/${normalized}`, CLOUDINARY_IMAGE_UPLOAD_BASE).toString();
}

export function withCloudinaryAutoParams(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return "";

  const uploadIndex = trimmed.indexOf(CLOUDINARY_IMAGE_UPLOAD_SEGMENT);
  if (uploadIndex === -1) {
    return trimmed;
  }

  const prefixEnd = uploadIndex + CLOUDINARY_IMAGE_UPLOAD_SEGMENT.length;
  const prefix = trimmed.slice(0, prefixEnd);
  const remainder = trimmed.slice(prefixEnd);
  if (!remainder) {
    return trimmed;
  }

  const firstSlashIndex = remainder.indexOf("/");
  if (firstSlashIndex === -1) {
    return `${prefix}f_auto,q_auto/${remainder}`;
  }

  const firstSegment = remainder.slice(0, firstSlashIndex);
  const rest = remainder.slice(firstSlashIndex + 1);
  const isVersionSegment = /^v\d+$/.test(firstSegment);
  const hasTransformations = !isVersionSegment;

  if (!hasTransformations) {
    return `${prefix}f_auto,q_auto/${remainder}`;
  }

  const parts = firstSegment.split(",").filter(Boolean);
  const hasAutoFormat = parts.some((part) => part === "f_auto");
  const hasAutoQuality = parts.some((part) => part === "q_auto");

  const nextParts = [...parts];
  if (!hasAutoFormat) nextParts.push("f_auto");
  if (!hasAutoQuality) nextParts.push("q_auto");

  return `${prefix}${nextParts.join(",")}/${rest}`;
}
