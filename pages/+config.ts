import type { Config } from "vike/types";
import vikeReact from "vike-react/config";

// Default config (can be overridden by pages)
// https://vike.dev/config

const config: Config = {
  // Enable server-side rendering so pages output SEO-friendly HTML.
  server: true,
  clientRouting: true,

  extends: [vikeReact],

  meta: {
    // Pages set `heroBackground: true` to get the shared fixed hero
    // background. The layout renders it (instead of the page itself) so it
    // stays outside the mobile drawer's pushed-aside page wrapper.
    heroBackground: {
      env: { server: true, client: true },
    },
  },
};

declare global {
  namespace Vike {
    interface Config {
      heroBackground?: boolean;
    }
  }
}

export default config;
