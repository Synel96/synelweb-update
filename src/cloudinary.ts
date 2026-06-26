import { env } from "@/src/env";

const CLOUDINARY_VIDEO_UPLOAD_BASE = `https://res.cloudinary.com/${env.VITE_CLOUDINARY_CLOUD_NAME}/video/upload/`;
const CLOUDINARY_IMAGE_UPLOAD_BASE = `https://res.cloudinary.com/${env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload/`;

export function cloudinaryVideoUrl(uploadPath: string) {
  const normalized = uploadPath.replace(/^\/+/, "");
  return new URL(normalized, CLOUDINARY_VIDEO_UPLOAD_BASE).toString();
}

export function cloudinaryImageUrl(uploadPath: string) {
  const normalized = uploadPath.replace(/^\/+/, "");
  return new URL(normalized, CLOUDINARY_IMAGE_UPLOAD_BASE).toString();
}
