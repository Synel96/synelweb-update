// Public values exposed to the browser (Vite convention: VITE_*). Validated by
// hand: four values don't justify shipping a schema library to every visitor
// (and Zod's runtime check trips the Content Security Policy).

type Env = {
  VITE_SITE_URL: string;
  VITE_BRAND_NAME: string;
  VITE_CLOUDINARY_CLOUD_NAME: string;
  VITE_API_BASE_URL: string;
};

const DEFAULTS: Env = {
  VITE_SITE_URL: "https://synelweb.hu",
  VITE_BRAND_NAME: "SynelWeb",
  VITE_CLOUDINARY_CLOUD_NAME: "dmwulp3dl",
  VITE_API_BASE_URL: "http://127.0.0.1:8000",
};

const URL_KEYS: ReadonlyArray<keyof Env> = ["VITE_SITE_URL", "VITE_API_BASE_URL"];

function isUrl(value: string): boolean {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

function readEnv(): Env {
  const raw: Record<keyof Env, unknown> = {
    VITE_SITE_URL: import.meta.env.VITE_SITE_URL,
    VITE_BRAND_NAME: import.meta.env.VITE_BRAND_NAME,
    VITE_CLOUDINARY_CLOUD_NAME: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
    VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  };
  const issues: string[] = [];
  const result = { ...DEFAULTS };

  for (const key of Object.keys(DEFAULTS) as Array<keyof Env>) {
    const value = raw[key];
    if (value === undefined) continue;
    if (typeof value !== "string" || value.length === 0) {
      issues.push(`- ${key}: must be a non-empty string`);
    } else if (URL_KEYS.includes(key) && !isUrl(value)) {
      issues.push(`- ${key}: must be a valid URL`);
    } else {
      result[key] = value;
    }
  }

  if (issues.length > 0) {
    throw new Error(`Invalid environment configuration:\n${issues.join("\n")}`);
  }
  return result;
}

export const env = readEnv();
