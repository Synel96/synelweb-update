import { findRegionalReference, type RegionalPageData } from "@/components/RegionalLandingPage";
import { getProjects } from "@/src/services/projectServices";
import { getServiceCards, type AppLang } from "@/src/services/serviceCardsService";

// Prerender data for a regional landing page. A backend hiccup at build time
// leaves the list empty; the page refetches it in the browser.
export async function loadRegionalPageData(lang: AppLang): Promise<RegionalPageData> {
  const [services, projects] = await Promise.all([
    getServiceCards(lang).catch(() => []),
    getProjects(lang).catch(() => []),
  ]);
  return { services, reference: findRegionalReference(projects) };
}
