import { usePageContext } from "vike-react/usePageContext";
import { resolveLanguageAndLogicalPath } from "../../src/localizedRoutes";

const HERO_VIDEO_POSTER_URL =
  "https://res.cloudinary.com/dmwulp3dl/image/upload/f_auto,q_auto:low,w_960,c_limit,dpr_auto/v1784120435/coverr-temp-sftfwatermarkedvideo00436be495bc341e4b7274f83a560daa2mp4-5896-1080p_1__exported_0_dkidt5.webp";

export function Head() {
  const pageContext = usePageContext() as { urlPathname: string };
  const { logicalPath } = resolveLanguageAndLogicalPath(pageContext.urlPathname);
  const isHomePage = logicalPath === "/";

  if (!isHomePage) return null;

  return (
    <link
      rel="preload"
      as="image"
      href={HERO_VIDEO_POSTER_URL}
      crossOrigin="anonymous"
      fetchPriority="high"
    />
  );
}
