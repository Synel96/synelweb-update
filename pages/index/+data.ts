import { DEFAULT_LANG, type SupportedLang } from "@/src/i18n-config";
import { getProjects } from "@/src/services/projectServices";
import { getReviews } from "@/src/services/reviewsService";
import type { AppLang } from "@/src/services/serviceCardsService";

export async function data(pageContext: { lang?: SupportedLang }) {
  const lang = (pageContext.lang ?? DEFAULT_LANG) as AppLang;

  const [projectsResult, reviewsResult] = await Promise.allSettled([
    getProjects(lang),
    getReviews(lang),
  ]);

  return {
    projects: projectsResult.status === "fulfilled" ? projectsResult.value : [],
    fetchError: projectsResult.status === "rejected",
    reviews: reviewsResult.status === "fulfilled" ? reviewsResult.value : [],
    reviewsFetchError: reviewsResult.status === "rejected",
  };
}
