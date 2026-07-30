import { afterEach, describe, expect, it, vi } from "vitest";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("env", () => {
  it("applies the documented defaults when nothing is set", async () => {
    vi.stubEnv("VITE_SITE_URL", undefined);
    vi.stubEnv("VITE_BRAND_NAME", undefined);
    vi.stubEnv("VITE_CLOUDINARY_CLOUD_NAME", undefined);
    vi.stubEnv("VITE_API_BASE_URL", undefined);

    const { env } = await import("./env");

    expect(env.VITE_SITE_URL).toBe("https://synelweb.hu");
    expect(env.VITE_BRAND_NAME).toBe("SynelWeb");
    expect(env.VITE_CLOUDINARY_CLOUD_NAME).toBe("dmwulp3dl");
    expect(env.VITE_API_BASE_URL).toBe("http://127.0.0.1:8000");
  });

  it("uses explicit overrides when provided", async () => {
    vi.stubEnv("VITE_SITE_URL", "https://example.com");
    vi.stubEnv("VITE_API_BASE_URL", "https://api.example.com");

    const { env } = await import("./env");

    expect(env.VITE_SITE_URL).toBe("https://example.com");
    expect(env.VITE_API_BASE_URL).toBe("https://api.example.com");
  });

  it("throws a descriptive error when a value fails validation", async () => {
    vi.stubEnv("VITE_SITE_URL", "not-a-url");

    await expect(import("./env")).rejects.toThrow(/Invalid environment configuration/);
  });
});
