import { afterEach, describe, expect, it, vi } from "vitest";

async function loadResolveApiBaseUrl() {
  vi.resetModules();
  const mod = await import("./apiBaseUrl");
  return mod.resolveApiBaseUrl;
}

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("resolveApiBaseUrl", () => {
  it("returns the configured URL as-is outside of production", async () => {
    vi.stubEnv("PROD", false);
    vi.stubEnv("VITE_API_BASE_URL", "http://127.0.0.1:8000");
    const resolveApiBaseUrl = await loadResolveApiBaseUrl();

    expect(resolveApiBaseUrl()).toBe("http://127.0.0.1:8000");
  });

  it("falls back to the production API when a localhost URL leaks into a production build", async () => {
    vi.stubEnv("PROD", true);
    vi.stubEnv("VITE_API_BASE_URL", "http://127.0.0.1:8000");
    const resolveApiBaseUrl = await loadResolveApiBaseUrl();

    expect(resolveApiBaseUrl()).toBe("https://synelweb.fly.dev");
  });

  it("falls back for a localhost hostname too, not just 127.0.0.1", async () => {
    vi.stubEnv("PROD", true);
    vi.stubEnv("VITE_API_BASE_URL", "http://localhost:8000");
    const resolveApiBaseUrl = await loadResolveApiBaseUrl();

    expect(resolveApiBaseUrl()).toBe("https://synelweb.fly.dev");
  });

  it("keeps a properly configured production URL unchanged", async () => {
    vi.stubEnv("PROD", true);
    vi.stubEnv("VITE_API_BASE_URL", "https://api.synelweb.hu");
    const resolveApiBaseUrl = await loadResolveApiBaseUrl();

    expect(resolveApiBaseUrl()).toBe("https://api.synelweb.hu");
  });
});
