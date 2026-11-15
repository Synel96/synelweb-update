import { REGIONAL_PAGES, localizePath } from "../../src/localizedRoutes";

// Hungarian only: see REGIONAL_PAGES.
export function onBeforePrerenderStart() {
  return [localizePath("/grants", REGIONAL_PAGES["/grants"].lang)];
}
