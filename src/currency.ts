import { useEffect, useState } from "react";
import { resolveApiBaseUrl } from "@/src/apiBaseUrl";
import { fetchWithTimeout } from "@/src/fetchWithTimeout";
import type { AppLang } from "@/src/services/serviceCardsService";

// Prices are set in HUF. Visitors on the German and English pages see them
// in EUR / USD, converted with the backend's daily exchange rate (the same
// one the services API uses), and rounded to a tidy amount.

export const CURRENCY_BY_LANG: Record<AppLang, string> = { hu: "HUF", en: "USD", de: "EUR" };
const LOCALE_BY_LANG: Record<AppLang, string> = { hu: "hu-HU", en: "en-US", de: "de-DE" };

type Rates = Record<string, number>;

let ratesPromise: Promise<Rates> | null = null;

export function loadHufRates(): Promise<Rates> {
  if (!ratesPromise) {
    ratesPromise = fetchWithTimeout(`${resolveApiBaseUrl()}/api/exchange-rates/`, {
      headers: { Accept: "application/json" },
    })
      .then((response) => (response.ok ? response.json() : { rates: {} }))
      .then((data: { rates?: Rates }) => data.rates ?? {})
      .catch(() => {
        ratesPromise = null; // try again next time
        return {};
      });
  }
  return ratesPromise;
}

// Converted prices shouldn't read like "372,46 €": round to a step that
// suits the size of the amount.
export function roundForDisplay(amount: number): number {
  const step = amount < 100 ? 5 : amount < 1000 ? 10 : amount < 10000 ? 50 : 100;
  return Math.max(step, Math.round(amount / step) * step);
}

export function formatMoney(amount: number, currency: string, lang: AppLang): string {
  const isHuf = currency === "HUF";
  return new Intl.NumberFormat(LOCALE_BY_LANG[lang] ?? LOCALE_BY_LANG.hu, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(isHuf ? Math.round(amount) : roundForDisplay(amount));
}

// Formats HUF amounts in the page's currency. Until the rate has loaded (or
// if it can't be), amounts stay in HUF, so a price is never wrong, at worst
// in forints.
export function useHufFormatter(lang: AppLang): (amountHuf: number) => string {
  const currency = CURRENCY_BY_LANG[lang] ?? "HUF";
  const [rate, setRate] = useState<number | null>(currency === "HUF" ? 1 : null);

  useEffect(() => {
    if (currency === "HUF") {
      setRate(1);
      return;
    }
    let active = true;
    void loadHufRates().then((rates) => {
      if (active) setRate(typeof rates[currency] === "number" ? rates[currency] : null);
    });
    return () => {
      active = false;
    };
  }, [currency]);

  return (amountHuf: number) =>
    rate === null
      ? formatMoney(amountHuf, "HUF", lang)
      : formatMoney(amountHuf * rate, currency, lang);
}

export function resetHufRatesForTests() {
  ratesPromise = null;
}
