import { DEFAULT_LANG, type SupportedLang } from "@/src/i18n-config";
import { getProjects } from "@/src/services/projectServices";
import type { AppLang } from "@/src/services/serviceCardsService";

export async function data(pageContext: { lang?: SupportedLang }) {
  const lang = (pageContext.lang ?? DEFAULT_LANG) as AppLang;

  try {
    const projects = await getProjects(lang);
    return {
      projects,
      fetchError: false,
    };
  } catch {
    return {
      projects: [],
      fetchError: true,
    };
  }
}
