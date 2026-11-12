import { REGIONAL_PAGES, localizePath } from "../../src/localizedRoutes";

// One language only: see REGIONAL_PAGES.
export function onBeforePrerenderStart() {
  return [localizePath("/sopron", REGIONAL_PAGES["/sopron"].lang)];
}
