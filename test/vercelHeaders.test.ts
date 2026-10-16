import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

type HeaderRule = { source: string; headers: { key: string; value: string }[] };

const root = resolve(__dirname, "..");
const vercelConfig = JSON.parse(readFileSync(resolve(root, "vercel.json"), "utf8")) as {
  headers: HeaderRule[];
};

function headerValue(source: string, key: string) {
  return vercelConfig.headers
    .find((rule) => rule.source === source)
    ?.headers.find((header) => header.key === key)?.value;
}

describe("vercel.json headers", () => {
  // The CSP allows the polyfill <script> in +Head.tsx by hash (not by
  // 'unsafe-inline', which browsers ignore once a hash is present), so any
  // edit to that script silently breaks it in production unless the hash is
  // updated too.
  it("whitelists the current hash of the inline polyfill script", () => {
    const head = readFileSync(resolve(root, "pages/+Head.tsx"), "utf8");
    const match = head.match(/__html: `([\s\S]*?)`,/);
    expect(match, "inline polyfill script not found in +Head.tsx").not.toBeNull();
    const script = match![1];
    expect(script).not.toContain("${");

    const hash = createHash("sha256").update(script).digest("base64");
    expect(headerValue("/(.*)", "Content-Security-Policy")).toContain(`'sha256-${hash}'`);
  });

  it("lets the CSP load the Cloudinary hero video and reach the API", () => {
    const csp = headerValue("/(.*)", "Content-Security-Policy") ?? "";
    expect(csp).toMatch(/media-src [^;]*https:\/\/res\.cloudinary\.com/);
    expect(csp).toMatch(/connect-src [^;]*https:\/\/synelweb\.fly\.dev/);
  });

  it("caches hashed build output forever but keeps HTML revalidating", () => {
    expect(headerValue("/assets/(.*)", "Cache-Control")).toContain("immutable");
    expect(headerValue("/chunks/(.*)", "Cache-Control")).toContain("immutable");
    expect(headerValue("/((?!assets/|chunks/|locales/).*)", "Cache-Control")).toContain(
      "max-age=0"
    );
  });
});
