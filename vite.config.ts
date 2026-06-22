import vike from "vike/plugin";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [vike(), react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          "vendor-react": ["react", "react-dom"],
          "vendor-vike": ["vike", "vike-react"],
        },
        chunkFileNames: "chunks/[name]-[hash].js",
        entryFileNames: "[name]-[hash].js",
      },
    },
    // Chunk size warning threshold (in kb)
    chunkSizeWarningLimit: 500,
    // Enable source maps in production for debugging
    sourcemap: false,
  },
});
