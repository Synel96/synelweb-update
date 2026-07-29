import vike from "vike/plugin";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ isSsrBuild }) => ({
  define: {
    // Cache-busts /public/locales/*.json across deploys — the query string
    // changes per build, so browsers with a stale locale bundle (from the
    // long-lived Cache-Control on /locales/*) fetch the fresh one instead.
    __LOCALE_VERSION__: JSON.stringify(Date.now().toString(36)),
  },
  plugins: [tailwindcss(), vike(), react()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./"),
    },
  },
  build: {
    minify: "esbuild",
    cssMinify: true,
    rollupOptions: {
      output: isSsrBuild
        ? undefined
        : {
            // Keep vendor libraries in stable chunks for better browser caching.
            manualChunks(id) {
              if (id.includes("node_modules/react") || id.includes("node_modules/react-dom")) {
                return "vendor-react";
              }
              if (id.includes("node_modules/vike") || id.includes("node_modules/vike-react")) {
                return "vendor-vike";
              }
              return undefined;
            },
            chunkFileNames: "chunks/[name]-[hash].js",
          },
    },
    // Chunk size warning threshold (in kb)
    chunkSizeWarningLimit: 500,
    // Disable source maps in production.
    sourcemap: false,
  },
}));
