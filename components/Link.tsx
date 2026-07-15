import { usePageContext } from "vike-react/usePageContext";
import { DEFAULT_LANG, type SupportedLang } from "@/src/i18n-config";
import { localizePath } from "@/src/localizedRoutes";

export function Link({ href, children }: { href: string; children: string }) {
  const pageContext = usePageContext() as { urlPathname: string; lang?: SupportedLang };
  const { urlPathname } = pageContext;
  const lang = pageContext.lang ?? DEFAULT_LANG;
  const isActive = href === "/" ? urlPathname === href : urlPathname.startsWith(href);
  return (
    <a href={localizePath(href, lang)} className={isActive ? "is-active" : undefined}>
      {children}
    </a>
  );
}
