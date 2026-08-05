// Background revalidation fetches (blog posts, service cards, projects,
// reviews) already have prerendered data on screen, so a slow or stuck
// backend response should never be allowed to hang indefinitely - it just
// needs to give up and let the existing content stand.
const DEFAULT_TIMEOUT_MS = 10_000;

export async function fetchWithTimeout(
  input: string,
  init: RequestInit = {},
  timeoutMs: number = DEFAULT_TIMEOUT_MS
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timeoutId);
  }
}
