import { SUPPORTED_LANGS } from "../../src/i18n-config";
import { localizePath } from "../../src/localizedRoutes";

export function onBeforePrerenderStart() {
  return SUPPORTED_LANGS.map((lang) => localizePath("/services", lang));
}
