import type { Config } from "vike/types";
import vikeReact from "vike-react/config";

// Default config (can be overridden by pages)
// https://vike.dev/config

const config: Config = {
  // Enable server-side rendering so pages output SEO-friendly HTML.
  server: true,
  clientRouting: true,

  extends: [vikeReact],
};

export default config;
