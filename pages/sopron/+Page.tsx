import { usePageContext } from "vike-react/usePageContext";
import { RegionalLandingPage, type RegionalPageData } from "@/components/RegionalLandingPage";

export default function Page() {
  const pageContext = usePageContext() as { data?: RegionalPageData };
  return (
    <RegionalLandingPage
      page="/sopron"
      lang="hu"
      initial={pageContext.data ?? { services: [], reference: null }}
    />
  );
}
