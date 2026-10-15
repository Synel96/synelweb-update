import type { Config } from "vike/types";

const config: Config = {
  prerender: true,
  // Overrides the inherited pages/blog setting: posts have no hero background.
  heroBackground: false,
};

export default config;
