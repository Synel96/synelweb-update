import type { SupportedLang } from "@/src/i18n-config";
import { localizePath } from "@/src/localizedRoutes";

// The contact page section the quote form sits in.
export const QUOTE_FORM_ANCHOR = "ajanlatkeres";

// Where "get a quote" / "let's start" buttons go: straight to the form on the
// contact page, not the top of the page.
export function quoteFormHref(
  lang: SupportedLang,
  service?: string,
  options: { site?: string } = {}
): string {
  const params: string[] = [];
  if (service) params.push(`service=${encodeURIComponent(service)}`);
  // A site the visitor just checked: the form mentions it in the message.
  if (options.site) params.push(`site=${encodeURIComponent(options.site)}`);
  const query = params.length > 0 ? `?${params.join("&")}` : "";
  return `${localizePath("/contact", lang)}${query}#${QUOTE_FORM_ANCHOR}`;
}
