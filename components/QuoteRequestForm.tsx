import { useEffect, useId, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import { CheckCircle2Icon, ClipboardListIcon, SendIcon, ZapIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { resolveApiBaseUrl } from "@/src/apiBaseUrl";
import { fetchWithTimeout } from "@/src/fetchWithTimeout";
import { getServiceCards, type AppLang } from "@/src/services/serviceCardsService";
import { prefersReducedMotion } from "@/src/prefersReducedMotion";
import { trackEvent } from "@/src/analytics";
import { useHufFormatter } from "@/src/currency";

export type QuoteMode = "simple" | "detailed";

const UNSURE = "unsure";

// Shown when the services can't be loaded, so the form still works.
const FALLBACK_SERVICE_KEYS = ["landing", "business", "webshop", "seo"] as const;

const EXISTING_SITE = ["none", "renew", "extend"] as const;
const DOMAIN = ["has", "none", "unsure"] as const;
const SIZES = ["one_page", "few_pages", "many_pages", "unsure"] as const;
const LANGUAGES = ["hu", "en", "de"] as const;
const ADDONS = [
  { key: "business_email", isNew: false },
  { key: "google_search_ads", isNew: true },
  { key: "cookieless_analytics", isNew: false },
] as const;
const TIMELINES = ["urgent", "one_two_months", "flexible"] as const;
const BUDGETS = ["under_200k", "200k_400k", "400k_800k", "over_800k", "unsure"] as const;
// The band limits in HUF; shown in the page's currency (see useHufFormatter).
const BUDGET_LIMITS_HUF: Record<(typeof BUDGETS)[number], { from?: number; to?: number }> = {
  under_200k: { to: 200_000 },
  "200k_400k": { from: 200_000, to: 400_000 },
  "400k_800k": { from: 400_000, to: 800_000 },
  over_800k: { from: 800_000 },
  unsure: {},
};
const CONTACT_PREFERENCES = ["email", "phone", "online", "in_person"] as const;

type Status = "idle" | "sending" | "sent" | "error" | "throttled";

type ServiceOption = { value: string; label: string };

type QuoteRequestFormProps = {
  lang: AppLang;
  privacyHref: string;
  initialService?: string;
  initialMode?: QuoteMode;
};

const INPUT_CLASS =
  "mt-2 w-full rounded-xl border border-white/15 bg-black/25 px-4 py-3 text-sm text-white placeholder:text-white/40 transition-colors focus:border-(--accent) focus:outline-none";

const LABEL_CLASS = "text-sm font-semibold text-white/85";

function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className={LABEL_CLASS}>{label}</span>
      {children}
      {hint ? <span className="mt-1.5 block text-xs text-white/50">{hint}</span> : null}
    </label>
  );
}

// A row of selectable pills: radio (one) or checkbox (several) inputs styled
// as chips, so they stay keyboard- and screen-reader-friendly.
function ChoiceGroup({
  legend,
  name,
  type,
  options,
  value,
  onChange,
}: {
  legend: string;
  name: string;
  type: "radio" | "checkbox";
  options: Array<{ value: string; label: string; badge?: string }>;
  value: string | string[];
  onChange: (next: string | string[]) => void;
}) {
  const isChecked = (option: string) =>
    Array.isArray(value) ? value.includes(option) : value === option;

  const toggle = (option: string) => {
    if (!Array.isArray(value)) {
      onChange(option);
      return;
    }
    onChange(value.includes(option) ? value.filter((item) => item !== option) : [...value, option]);
  };

  return (
    <fieldset>
      <legend className={LABEL_CLASS}>{legend}</legend>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((option) => (
          <label
            key={option.value}
            className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-3.5 py-2 text-sm transition-colors has-focus-visible:outline-2 has-focus-visible:outline-(--ring) ${
              isChecked(option.value)
                ? "border-(--accent)/70 bg-(--accent)/15 text-white"
                : "border-white/15 bg-white/4 text-white/75 hover:border-white/30"
            }`}
          >
            <input
              type={type}
              name={name}
              value={option.value}
              checked={isChecked(option.value)}
              onChange={() => toggle(option.value)}
              className="sr-only"
            />
            {option.label}
            {option.badge ? (
              <span className="rounded-full bg-linear-to-r from-(--color-secondary-warm) to-(--accent) px-2 py-0.5 text-[0.62rem] font-extrabold tracking-[0.12em] text-[#140814] uppercase">
                {option.badge}
              </span>
            ) : null}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function QuoteRequestForm({
  lang,
  privacyHref,
  initialService = "",
  initialMode = "simple",
}: QuoteRequestFormProps) {
  const { t } = useTranslation();
  const formId = useId();
  const [mode, setMode] = useState<QuoteMode>(initialMode);
  const formatHuf = useHufFormatter(lang);
  const [services, setServices] = useState<ServiceOption[]>([]);
  const [status, setStatus] = useState<Status>("idle");

  const [service, setService] = useState(initialService);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [company, setCompany] = useState("");

  const [existingSite, setExistingSite] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [domain, setDomain] = useState("");
  const [domainName, setDomainName] = useState("");
  const [size, setSize] = useState("");
  const [languages, setLanguages] = useState<string[]>([lang]);
  const [addons, setAddons] = useState<string[]>([]);
  const [timeline, setTimeline] = useState("");
  const [budget, setBudget] = useState("");
  const [isLocal, setIsLocal] = useState(false);
  const [isGrantFunded, setIsGrantFunded] = useState(false);
  const [contactPreference, setContactPreference] = useState("");

  useEffect(() => {
    let isMounted = true;
    getServiceCards(lang)
      .then((cards) => {
        if (!isMounted) return;
        setServices(cards.map((card) => ({ value: card.slug || card.id, label: card.name })));
      })
      .catch(() => {
        // Keep the fallback options.
      });
    return () => {
      isMounted = false;
    };
  }, [lang]);

  const serviceOptions = useMemo<ServiceOption[]>(() => {
    const base =
      services.length > 0
        ? services
        : FALLBACK_SERVICE_KEYS.map((key) => ({
            value: key,
            label: t(`homeFlow.services.badges.${key}`),
          }));
    return [...base, { value: UNSURE, label: t("quoteForm.serviceUnsure") }];
  }, [services, t]);

  // A service passed in the URL that isn't (or is no longer) on offer would
  // leave nothing visibly selected; fall back to "not sure yet".
  useEffect(() => {
    if (services.length === 0 || !service) return;
    if (service !== UNSURE && !services.some((option) => option.value === service)) {
      setService(UNSURE);
    }
  }, [services, service]);

  const options = <T extends string>(keys: readonly T[], prefix: string) =>
    keys.map((key) => ({ value: key, label: t(`${prefix}.${key}`) }));

  // The thank-you card is much shorter than the form it replaces, so the page
  // shrinks and the browser is left near the bottom of it. Bring the card
  // into view (and focus, for keyboard and screen-reader users) instead.
  const sentRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (status !== "sent") return;
    const card = sentRef.current;
    if (!card) return;
    card.scrollIntoView({
      block: "center",
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
    card.focus({ preventScroll: true });
  }, [status]);

  // Counted once per visit to the form: the first time anything in it gets
  // focus, i.e. the visitor starts filling it in (or picks a mode/service).
  const startedRef = useRef(false);
  const markStarted = () => {
    if (startedRef.current) return;
    startedRef.current = true;
    trackEvent("quote_form_start", { mode });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "sending") return;
    setStatus("sending");

    const payload: Record<string, unknown> = {
      mode,
      service: service || UNSURE,
      // The id alone (a slug, or a number when a service has no slug) means
      // nothing in the alert e-mail; send the name the visitor saw too.
      serviceName:
        serviceOptions.find((option) => option.value === (service || UNSURE))?.label ?? "",
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      message: message.trim(),
      consent,
      siteLanguage: lang,
      company,
    };
    if (mode === "detailed") {
      Object.assign(payload, {
        existingSite,
        websiteUrl: existingSite && existingSite !== "none" ? websiteUrl.trim() : "",
        domain,
        domainName: domain === "has" ? domainName.trim() : "",
        size,
        languages,
        addons,
        timeline,
        budget,
        isLocal,
        isGrantFunded,
        contactPreference,
      });
    }

    const report = (result: "success" | "error" | "throttled") =>
      trackEvent("quote_form_submit", { mode, service: service || UNSURE, result });

    try {
      const response = await fetchWithTimeout(`${resolveApiBaseUrl()}/api/quote-requests/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      if (response.status === 429) {
        report("throttled");
        setStatus("throttled");
        return;
      }
      report(response.ok ? "success" : "error");
      setStatus(response.ok ? "sent" : "error");
    } catch {
      report("error");
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <div
        ref={sentRef}
        tabIndex={-1}
        className="fancy-card scroll-mt-28 rounded-3xl p-8 text-center outline-none sm:p-10"
        role="status"
      >
        <CheckCircle2Icon className="mx-auto size-12 text-emerald-300" aria-hidden="true" />
        <h3 className="mt-4 text-2xl font-semibold text-white">{t("quoteForm.sentTitle")}</h3>
        <p className="mx-auto mt-3 max-w-xl text-base leading-7 text-white/78">
          {t("quoteForm.sentText")}
        </p>
      </div>
    );
  }

  const modes: Array<{ key: QuoteMode; Icon: typeof ZapIcon }> = [
    { key: "simple", Icon: ZapIcon },
    { key: "detailed", Icon: ClipboardListIcon },
  ];

  return (
    <form
      onSubmit={handleSubmit}
      onFocusCapture={markStarted}
      className="fancy-card rounded-3xl p-5 sm:p-8"
    >
      <div
        role="radiogroup"
        aria-label={t("quoteForm.modeLabel")}
        className="grid gap-2 rounded-2xl bg-black/25 p-1.5 sm:grid-cols-2"
      >
        {modes.map(({ key, Icon }) => {
          const isActive = mode === key;
          return (
            <button
              key={key}
              type="button"
              role="radio"
              aria-checked={isActive}
              onClick={() => {
                if (key !== mode) trackEvent("quote_form_mode", { mode: key });
                setMode(key);
              }}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-left transition-colors ${
                isActive
                  ? "bg-linear-to-r from-(--color-secondary-warm)/20 to-(--accent)/25 text-white ring-1 ring-(--accent)/50"
                  : "text-white/65 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon
                className={`size-5 shrink-0 ${isActive ? "text-(--accent)" : ""}`}
                aria-hidden="true"
              />
              <span>
                <span className="block text-sm font-semibold">
                  {t(`quoteForm.modes.${key}.title`)}
                </span>
                <span className="block text-xs text-white/55">
                  {t(`quoteForm.modes.${key}.hint`)}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-6 space-y-5">
        <ChoiceGroup
          legend={t("quoteForm.service")}
          name={`${formId}-service`}
          type="radio"
          options={serviceOptions}
          value={service}
          onChange={(next) => setService(next as string)}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={t("quoteForm.name")}>
            <input
              required
              minLength={2}
              maxLength={120}
              autoComplete="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className={INPUT_CLASS}
            />
          </Field>
          <Field label={t("quoteForm.email")}>
            <input
              required
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className={INPUT_CLASS}
            />
          </Field>
        </div>

        <Field label={t("quoteForm.phone")} hint={t("quoteForm.phoneHint")}>
          <input
            type="tel"
            autoComplete="tel"
            maxLength={40}
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            className={INPUT_CLASS}
          />
        </Field>

        <Field label={t("quoteForm.message")}>
          <textarea
            required
            minLength={10}
            maxLength={4000}
            rows={4}
            placeholder={t("quoteForm.messagePlaceholder")}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            className={`${INPUT_CLASS} leading-7`}
          />
        </Field>

        {mode === "detailed" ? (
          <div className="space-y-5 border-t border-white/10 pt-5">
            <p className="fancy-eyebrow text-xs font-semibold tracking-[0.18em] text-(--accent) uppercase">
              {t("quoteForm.detailsTitle")}
            </p>

            <ChoiceGroup
              legend={t("quoteForm.existingSite")}
              name={`${formId}-existing`}
              type="radio"
              options={options(EXISTING_SITE, "quoteForm.existingSiteOptions")}
              value={existingSite}
              onChange={(next) => setExistingSite(next as string)}
            />
            {existingSite && existingSite !== "none" ? (
              <Field label={t("quoteForm.websiteUrl")}>
                <input
                  type="text"
                  inputMode="url"
                  maxLength={300}
                  placeholder="https://"
                  value={websiteUrl}
                  onChange={(event) => setWebsiteUrl(event.target.value)}
                  className={INPUT_CLASS}
                />
              </Field>
            ) : null}

            <ChoiceGroup
              legend={t("quoteForm.domain")}
              name={`${formId}-domain`}
              type="radio"
              options={options(DOMAIN, "quoteForm.domainOptions")}
              value={domain}
              onChange={(next) => setDomain(next as string)}
            />
            {domain === "has" ? (
              <Field label={t("quoteForm.domainName")}>
                <input
                  type="text"
                  inputMode="url"
                  autoCapitalize="none"
                  maxLength={253}
                  placeholder={t("quoteForm.domainNamePlaceholder")}
                  value={domainName}
                  onChange={(event) => setDomainName(event.target.value)}
                  className={INPUT_CLASS}
                />
              </Field>
            ) : null}

            <ChoiceGroup
              legend={t("quoteForm.size")}
              name={`${formId}-size`}
              type="radio"
              options={options(SIZES, "quoteForm.sizeOptions")}
              value={size}
              onChange={(next) => setSize(next as string)}
            />

            <ChoiceGroup
              legend={t("quoteForm.languages")}
              name={`${formId}-languages`}
              type="checkbox"
              options={options(LANGUAGES, "quoteForm.languageOptions")}
              value={languages}
              onChange={(next) => setLanguages(next as string[])}
            />

            <ChoiceGroup
              legend={t("quoteForm.addons")}
              name={`${formId}-addons`}
              type="checkbox"
              options={ADDONS.map(({ key, isNew }) => ({
                value: key,
                label: t(`quoteForm.addonOptions.${key}`),
                badge: isNew ? t("quoteForm.newBadge") : undefined,
              }))}
              value={addons}
              onChange={(next) => setAddons(next as string[])}
            />

            <ChoiceGroup
              legend={t("quoteForm.timeline")}
              name={`${formId}-timeline`}
              type="radio"
              options={options(TIMELINES, "quoteForm.timelineOptions")}
              value={timeline}
              onChange={(next) => setTimeline(next as string)}
            />

            <ChoiceGroup
              legend={t("quoteForm.budget")}
              name={`${formId}-budget`}
              type="radio"
              options={BUDGETS.map((key) => {
                const { from, to } = BUDGET_LIMITS_HUF[key];
                return {
                  value: key,
                  label: t(`quoteForm.budgetOptions.${key}`, {
                    from: from === undefined ? "" : formatHuf(from),
                    to: to === undefined ? "" : formatHuf(to),
                  }),
                };
              })}
              value={budget}
              onChange={(next) => setBudget(next as string)}
            />

            <ChoiceGroup
              legend={t("quoteForm.contactPreference")}
              name={`${formId}-contact`}
              type="radio"
              options={options(CONTACT_PREFERENCES, "quoteForm.contactPreferenceOptions")}
              value={contactPreference}
              onChange={(next) => setContactPreference(next as string)}
            />

            <div className="space-y-3">
              <label className="flex items-start gap-3 text-sm text-white/80">
                <input
                  type="checkbox"
                  checked={isLocal}
                  onChange={(event) => setIsLocal(event.target.checked)}
                  className="mt-0.5 size-4 shrink-0 accent-(--accent)"
                />
                {t("quoteForm.isLocal")}
              </label>
              <label className="flex items-start gap-3 text-sm text-white/80">
                <input
                  type="checkbox"
                  checked={isGrantFunded}
                  onChange={(event) => setIsGrantFunded(event.target.checked)}
                  className="mt-0.5 size-4 shrink-0 accent-(--accent)"
                />
                {t("quoteForm.isGrantFunded")}
              </label>
            </div>
          </div>
        ) : null}

        {/* Honeypot: hidden from people, so only bots fill it in. */}
        <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
          <label>
            Company
            <input
              tabIndex={-1}
              autoComplete="off"
              value={company}
              onChange={(event) => setCompany(event.target.value)}
              name="company"
            />
          </label>
        </div>

        <label className="flex items-start gap-3 text-sm leading-6 text-white/80">
          <input
            type="checkbox"
            required
            checked={consent}
            onChange={(event) => setConsent(event.target.checked)}
            className="mt-1 size-4 shrink-0 accent-(--accent)"
          />
          <span>
            {t("quoteForm.consentBefore")}{" "}
            <a
              href={privacyHref}
              target="_blank"
              rel="noreferrer"
              className="text-(--accent) underline underline-offset-4"
            >
              {t("quoteForm.consentLink")}
            </a>
            {t("quoteForm.consentAfter")}
          </span>
        </label>

        {status === "error" || status === "throttled" ? (
          <p
            role="alert"
            className="rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-100"
          >
            {status === "throttled" ? t("quoteForm.throttled") : t("quoteForm.error")}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={status === "sending"}
          className="btn-cta group relative flex min-h-14 w-full items-center justify-center gap-2 overflow-hidden rounded-[1.15rem] border border-white/15 px-6 py-3 text-sm font-extrabold tracking-[0.08em] text-[#140814] uppercase ring-1 ring-white/20 transition-all duration-300 hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-70 sm:text-base"
        >
          <span className="relative z-10 flex items-center gap-2">
            {status === "sending" ? t("quoteForm.sending") : t(`quoteForm.submit.${mode}`)}
            <SendIcon className="size-4 shrink-0" aria-hidden="true" />
          </span>
          <span className="btn-cta-shine" aria-hidden="true" />
        </button>

        <p className="text-center text-xs text-white/50">{t("quoteForm.responseTime")}</p>
      </div>
    </form>
  );
}
