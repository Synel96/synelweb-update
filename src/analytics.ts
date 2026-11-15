import { track } from "@vercel/analytics";

// Conversion events for Vercel Web Analytics (custom events). Values are
// short labels only, never what a visitor typed: no names, e-mails or phone
// numbers, so the cookie-free analytics stays free of personal data.

export type QuoteCtaLocation =
  | "home_hero"
  | "sticky_cta"
  | "service_card"
  | "projects"
  | "about"
  | "technology"
  | "blog_post"
  | "certificates"
  | "sopron_hero"
  | "sopron_final"
  | "austria_hero"
  | "austria_final"
  | "google_ads_hero"
  | "google_ads_final";

export type ContactMethod = "phone" | "email" | "facebook" | "linkedin";

type Events = {
  quote_cta_click: { location: QuoteCtaLocation; service?: string };
  quote_form_start: { mode: string };
  quote_form_mode: { mode: string };
  quote_form_step: { step: string; mode: string };
  quote_form_submit: { mode: string; service: string; result: "success" | "error" | "throttled" };
  contact_click: { method: ContactMethod; location: string };
};

export type AnalyticsEvent = keyof Events;

export function trackEvent<E extends AnalyticsEvent>(event: E, data: Events[E]): void {
  try {
    // Drop empty optional values rather than sending "undefined".
    const clean = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined && value !== "")
    ) as Record<string, string>;
    track(event, clean);
  } catch {
    // Measuring must never break a click or a form.
  }
}
