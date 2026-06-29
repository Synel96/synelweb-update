import { SUPPORTED_LANGS } from "../../src/i18n-config";

export function onBeforePrerenderStart() {
  return SUPPORTED_LANGS.map((lang) => `/${lang}/technology`);
}
