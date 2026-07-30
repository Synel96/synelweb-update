import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  define: {
    __LOCALE_VERSION__: JSON.stringify("test"),
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./"),
    },
  },
  test: {
    environment: "jsdom",
    globals: false,
    setupFiles: ["./vitest.setup.ts"],
    css: false,
    restoreMocks: true,
    clearMocks: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "json-summary"],
      include: ["src/**/*.{ts,tsx}", "components/**/*.{ts,tsx}", "pages/**/*.ts"],
      exclude: [
        "**/*.test.{ts,tsx}",
        "src/i18n.ts",
        "pages/**/+Page.tsx",
        "pages/**/+Layout.tsx",
        "pages/**/+Head.tsx",
        "components/ui/**",
      ],
    },
  },
});
