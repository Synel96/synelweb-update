import { z } from "zod";

const envSchema = z.object({
  // Public values exposed to the browser (Vite convention: VITE_*)
  VITE_SITE_URL: z.string().url().default("https://example.com"),
  VITE_BRAND_NAME: z.string().min(1).default("SynelWeb"),
  VITE_CLOUDINARY_CLOUD_NAME: z.string().min(1).default("dmwulp3dl"),
});

const parsed = envSchema.safeParse({
  VITE_SITE_URL: import.meta.env.VITE_SITE_URL,
  VITE_BRAND_NAME: import.meta.env.VITE_BRAND_NAME,
  VITE_CLOUDINARY_CLOUD_NAME: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
});

if (!parsed.success) {
  const issues = parsed.error.issues.map((issue) => `- ${issue.path.join(".")}: ${issue.message}`);
  throw new Error(`Invalid environment configuration:\n${issues.join("\n")}`);
}

export const env = parsed.data;
