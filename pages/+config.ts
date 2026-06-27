import type { Config } from "vike/types";
import vikeReact from "vike-react/config";

// Default config (can be overridden by pages)
// https://vike.dev/config

const config: Config = {
  // https://vike.dev/head-tags
  title: "SynelWeb",
  description: "SynelWeb - modern webfejlesztés, gyors oldalak és prémium digitális élmény.",
  // Generate HTML at build-time and keep SPA-like navigation on the client.
  server: false,
  clientRouting: true,

  extends: [vikeReact],
};

export default config;
