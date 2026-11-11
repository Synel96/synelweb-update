import type { SupportedLang } from "@/src/i18n-config";
import { localizePath } from "@/src/localizedRoutes";

// The contact page section the quote form sits in.
export const QUOTE_FORM_ANCHOR = "ajanlatkeres";

// Where "get a quote" / "let's start" buttons go: straight to the form on the
// contact page, not the top of the page.
export function quoteFormHref(lang: SupportedLang, service?: string): string {
  const query = service ? `?service=${encodeURIComponent(service)}` : "";
  return `${localizePath("/contact", lang)}${query}#${QUOTE_FORM_ANCHOR}`;
}
