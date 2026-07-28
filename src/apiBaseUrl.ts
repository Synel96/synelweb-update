import { env } from "@/src/env";

const DEFAULT_PROD_API_BASE_URL = "https://synelweb.fly.dev";

// Falls back to the production API whenever a localhost/127.0.0.1 value
// leaks into a production build (e.g. a missing VITE_API_BASE_URL override).
export function resolveApiBaseUrl() {
  const configured = env.VITE_API_BASE_URL.trim();

  if (
    import.meta.env.PROD &&
    (configured.includes("127.0.0.1") || configured.includes("localhost"))
  ) {
    return DEFAULT_PROD_API_BASE_URL;
  }

  return configured;
}
