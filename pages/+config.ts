import type { Config } from "vike/types";
import vikeReact from "vike-react/config";

// Default config (can be overridden by pages)
// https://vike.dev/config

const config: Config = {
  // Generate HTML at build-time and keep SPA-like navigation on the client.
  server: false,
  clientRouting: true,

  extends: [vikeReact],
};

export default config;
