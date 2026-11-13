import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { renderWithI18n } from "../test/render";

const { getServiceCards, fetchWithTimeout, trackEvent } = vi.hoisted(() => ({
  getServiceCards: vi.fn(),
  fetchWithTimeout: vi.fn(),
  trackEvent: vi.fn(),
}));
vi.mock("@/src/services/serviceCardsService", () => ({ getServiceCards }));
vi.mock("@/src/fetchWithTimeout", () => ({ fetchWithTimeout }));
vi.mock("@/src/analytics", () => ({ trackEvent }));

import { QuoteRequestForm } from "./QuoteRequestForm";

const SERVICES = [
  { id: "1", name: "Landing oldal", slug: "landing-oldal" },
  { id: "2", name: "Webshop", slug: "webshop" },
];

function next() {
  fireEvent.click(screen.getByRole("button", { name: /Tovább/ }));
}

// From the first step: fills in the contact and project steps and stays on
// the project step, where the detailed questions are.
function fillContact() {
  next();
  fireEvent.change(screen.getByLabelText("Név"), { target: { value: "Teszt Elek" } });
  fireEvent.change(screen.getByLabelText("E-mail"), { target: { value: "teszt@pelda.hu" } });
  next();
  fireEvent.change(screen.getByLabelText("Pár mondat a projektről"), {
    target: { value: "Egy egyszerű bemutatkozó oldal kellene." },
  });
}

// Moves on to the last step, accepts the privacy notice and sends.
function submit() {
  next();
  fireEvent.click(screen.getByRole("checkbox", { name: /adatkezelési tájékoztatót/ }));
  fireEvent.submit(screen.getByRole("button", { name: /kérek/ }).closest("form")!);
}

function sentPayload() {
  const [, init] = fetchWithTimeout.mock.calls[0];
  return JSON.parse(init.body as string);
}

describe("QuoteRequestForm", () => {
  beforeEach(() => {
    getServiceCards.mockResolvedValue(SERVICES);
    fetchWithTimeout.mockResolvedValue({ ok: true, status: 201 });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("starts in the simplified mode without the detail fields", async () => {
    await renderWithI18n(<QuoteRequestForm lang="hu" privacyHref="/adatkezeles" />);

    expect(screen.getByRole("radio", { name: /Egyszerűsített ajánlat/ })).toHaveAttribute(
      "aria-checked",
      "true"
    );
    expect(screen.queryByText("Kiegészítők")).not.toBeInTheDocument();
  });

  it("offers exactly the three add-ons in detailed mode, Google Search ads marked new", async () => {
    await renderWithI18n(<QuoteRequestForm lang="hu" privacyHref="/adatkezeles" />);

    fireEvent.click(screen.getByRole("radio", { name: /Részletes ajánlat/ }));
    fillContact();

    const addons = screen.getByText("Kiegészítők").closest("fieldset")!;
    const boxes = addons.querySelectorAll('input[type="checkbox"]');
    expect(Array.from(boxes).map((box) => (box as HTMLInputElement).value)).toEqual([
      "business_email",
      "google_search_ads",
      "cookieless_analytics",
    ]);
    expect(screen.getByText("Google keresőhirdetés").closest("label")).toHaveTextContent("Új");
    expect(screen.getByText("Céges e-mail").closest("label")).not.toHaveTextContent("Új");
  });

  it("lists the live services and preselects the one passed in", async () => {
    await renderWithI18n(
      <QuoteRequestForm lang="hu" privacyHref="/adatkezeles" initialService="webshop" />
    );

    await screen.findByRole("radio", { name: "Webshop" });
    expect(screen.getByRole("radio", { name: "Webshop" })).toBeChecked();
    expect(screen.getByRole("radio", { name: /Még nem tudom, segíts/ })).toBeInTheDocument();
  });

  it("falls back to 'not sure' for a service that isn't offered", async () => {
    await renderWithI18n(
      <QuoteRequestForm lang="hu" privacyHref="/adatkezeles" initialService="megszunt" />
    );

    await waitFor(() =>
      expect(screen.getByRole("radio", { name: /Még nem tudom, segíts/ })).toBeChecked()
    );
  });

  it("sends a simplified request without detail fields", async () => {
    await renderWithI18n(
      <QuoteRequestForm lang="hu" privacyHref="/adatkezeles" initialService="landing-oldal" />
    );
    await screen.findByRole("radio", { name: "Landing oldal" });

    fillContact();
    submit();

    await screen.findByText("Köszönöm, megkaptam az ajánlatkérésed!");
    const [url] = fetchWithTimeout.mock.calls[0];
    expect(url).toMatch(/\/api\/quote-requests\/$/);
    const payload = sentPayload();
    expect(payload).toMatchObject({
      mode: "simple",
      service: "landing-oldal",
      serviceName: "Landing oldal",
      name: "Teszt Elek",
      consent: true,
      siteLanguage: "hu",
      company: "",
    });
    expect(payload).not.toHaveProperty("addons");
  });

  it("sends the chosen details in detailed mode", async () => {
    await renderWithI18n(<QuoteRequestForm lang="hu" privacyHref="/adatkezeles" />);
    await screen.findByRole("radio", { name: "Webshop" });

    fireEvent.click(screen.getByRole("radio", { name: /Részletes ajánlat/ }));
    fireEvent.click(screen.getByRole("radio", { name: "Webshop" }));
    fillContact();
    fireEvent.click(screen.getByRole("radio", { name: "Van" }));
    fireEvent.change(screen.getByLabelText("A domain neve"), {
      target: { value: " pelda.hu " },
    });
    fireEvent.click(screen.getByRole("checkbox", { name: /Google keresőhirdetés/ }));
    fireEvent.click(screen.getByRole("checkbox", { name: "Német" }));
    fireEvent.click(screen.getByRole("radio", { name: /^200\s000\sFt – 400\s000\sFt$/ }));
    fireEvent.click(screen.getByRole("checkbox", { name: /Sopron környéki/ }));
    submit();

    await screen.findByText("Köszönöm, megkaptam az ajánlatkérésed!");
    expect(sentPayload()).toMatchObject({
      mode: "detailed",
      service: "webshop",
      domain: "has",
      domainName: "pelda.hu",
      addons: ["google_search_ads"],
      languages: ["hu", "de"],
      budget: "200k_400k",
      isLocal: true,
    });
  });

  it("brings the thank-you message into view and focuses it", async () => {
    const scrollIntoView = vi
      .spyOn(Element.prototype, "scrollIntoView")
      .mockImplementation(() => {});
    await renderWithI18n(<QuoteRequestForm lang="hu" privacyHref="/adatkezeles" />);

    fillContact();
    submit();

    const thanks = await screen.findByRole("status");
    expect(scrollIntoView).toHaveBeenCalledWith(expect.objectContaining({ block: "center" }));
    expect(thanks).toHaveFocus();
    scrollIntoView.mockRestore();
  });

  it("asks about the campaign instead of the website for an ad campaign only", async () => {
    await renderWithI18n(
      <QuoteRequestForm lang="hu" privacyHref="/adatkezeles" initialService="google-ads" />
    );
    await screen.findByRole("radio", { name: "Webshop" });

    expect(
      screen.getByRole("radio", { name: "Csak hirdetési kampány (Google Ads)" })
    ).toBeChecked();
    fireEvent.click(screen.getByRole("radio", { name: /Részletes ajánlat/ }));
    fillContact();
    expect(screen.queryByText("Kiegészítők")).not.toBeInTheDocument();
    expect(screen.queryByText("Van már weboldalad?")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("radio", { name: "Nincs még" }));
    fireEvent.change(screen.getByLabelText(/A weboldalad címe/), {
      target: { value: " https://pelda.hu " },
    });
    fireEvent.click(screen.getByRole("radio", { name: /^60\s000\sFt – 150\s000\sFt$/ }));
    submit();

    await screen.findByRole("status");
    const payload = sentPayload();
    expect(payload).toMatchObject({
      mode: "detailed",
      service: "google-ads",
      serviceName: "Csak hirdetési kampány (Google Ads)",
      adsAccount: "none",
      adBudget: "60k_150k",
      websiteUrl: "https://pelda.hu",
    });
    expect(payload).not.toHaveProperty("addons");
    expect(payload).not.toHaveProperty("domain");
  });

  it("sends the visitor-facing name of 'not sure yet'", async () => {
    await renderWithI18n(<QuoteRequestForm lang="hu" privacyHref="/adatkezeles" />);

    fillContact();
    submit();

    await screen.findByRole("status");
    expect(sentPayload()).toMatchObject({
      service: "unsure",
      serviceName: "Még nem tudom, segíts választani",
    });
  });

  it("measures start (once), mode switch and the submit result, without personal data", async () => {
    await renderWithI18n(
      <QuoteRequestForm lang="hu" privacyHref="/adatkezeles" initialService="webshop" />
    );
    await screen.findByRole("radio", { name: "Webshop" });

    fireEvent.focus(screen.getByRole("radio", { name: "Webshop" }));
    fireEvent.focus(screen.getByRole("radio", { name: "Landing oldal" }));
    fireEvent.click(screen.getByRole("radio", { name: /Részletes ajánlat/ }));
    fillContact();
    submit();
    await screen.findByRole("status");

    expect(trackEvent.mock.calls).toEqual([
      ["quote_form_start", { mode: "simple" }],
      ["quote_form_mode", { mode: "detailed" }],
      ["quote_form_step", { step: "contact", mode: "detailed" }],
      ["quote_form_step", { step: "project", mode: "detailed" }],
      ["quote_form_step", { step: "send", mode: "detailed" }],
      ["quote_form_submit", { mode: "detailed", service: "webshop", result: "success" }],
    ]);
    expect(JSON.stringify(trackEvent.mock.calls)).not.toMatch(/Teszt|pelda\.hu/);
  });

  it("reports a failed submit", async () => {
    fetchWithTimeout.mockResolvedValue({ ok: false, status: 500 });
    await renderWithI18n(<QuoteRequestForm lang="hu" privacyHref="/adatkezeles" />);

    fillContact();
    submit();
    await screen.findByRole("alert");

    expect(trackEvent).toHaveBeenCalledWith("quote_form_submit", {
      mode: "simple",
      service: "unsure",
      result: "error",
    });
  });

  it("explains a rate limit and keeps the form", async () => {
    fetchWithTimeout.mockResolvedValue({ ok: false, status: 429 });
    await renderWithI18n(<QuoteRequestForm lang="hu" privacyHref="/adatkezeles" />);

    fillContact();
    submit();

    expect(await screen.findByRole("alert")).toHaveTextContent(/túl sok ajánlatkérés/);
    // Still on the last step, with the answers kept.
    expect(screen.getByText("Teszt Elek")).toBeInTheDocument();
  });

  it("shows an error with the e-mail fallback when sending fails", async () => {
    fetchWithTimeout.mockRejectedValue(new Error("offline"));
    await renderWithI18n(<QuoteRequestForm lang="hu" privacyHref="/adatkezeles" />);

    fillContact();
    submit();

    expect(await screen.findByRole("alert")).toHaveTextContent("info@synelweb.hu");
  });

  it("still offers the general service types when the services can't be loaded", async () => {
    getServiceCards.mockRejectedValue(new Error("offline"));
    await renderWithI18n(<QuoteRequestForm lang="hu" privacyHref="/adatkezeles" />);

    expect(await screen.findByRole("radio", { name: "Landing oldal" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "SEO alapárban" })).toBeInTheDocument();
  });

  it("shows where the visitor is and does not move on with an invalid e-mail", async () => {
    await renderWithI18n(<QuoteRequestForm lang="hu" privacyHref="/adatkezeles" />);

    expect(screen.getByText("1. lépés / 4")).toBeInTheDocument();
    next();
    expect(screen.getByText("2. lépés / 4")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Név"), { target: { value: "Teszt Elek" } });
    fireEvent.change(screen.getByRole("textbox", { name: /^E-mail/ }), { target: { value: "nem-email" } });
    next();

    expect(screen.getByText("2. lépés / 4")).toBeInTheDocument();
    expect(screen.getByText("Adj meg egy érvényes e-mail-címet.")).toBeInTheDocument();
    expect(fetchWithTimeout).not.toHaveBeenCalled();
  });

  it("keeps the answers when going back, and lists them before sending", async () => {
    await renderWithI18n(<QuoteRequestForm lang="hu" privacyHref="/adatkezeles" />);

    fillContact();
    fireEvent.click(screen.getByRole("button", { name: /Vissza/ }));
    expect(screen.getByLabelText("Név")).toHaveValue("Teszt Elek");

    next();
    next();
    expect(screen.getByText("4. lépés / 4")).toBeInTheDocument();
    expect(screen.getByText("teszt@pelda.hu")).toBeInTheDocument();
    expect(screen.getByText("Egy egyszerű bemutatkozó oldal kellene.")).toBeInTheDocument();
  });

  it("asks how to get in touch, needs a number for a call back, and sends it in simple mode", async () => {
    await renderWithI18n(<QuoteRequestForm lang="hu" privacyHref="/adatkezeles" />);

    next();
    fireEvent.change(screen.getByLabelText("Név"), { target: { value: "Teszt Elek" } });
    fireEvent.change(screen.getByRole("textbox", { name: /^E-mail/ }), { target: { value: "teszt@pelda.hu" } });
    fireEvent.click(screen.getByRole("radio", { name: "Telefonon" }));
    next();
    expect(
      screen.getByText("Ha telefonon kérsz visszahívást, add meg a számod.")
    ).toBeInTheDocument();

    fireEvent.change(screen.getByRole("textbox", { name: /^Telefon/ }), { target: { value: "+36 30 123 4567" } });
    next();
    fireEvent.change(screen.getByLabelText("Pár mondat a projektről"), {
      target: { value: "Egy egyszerű bemutatkozó oldal kellene." },
    });
    submit();

    await screen.findByRole("status");
    expect(sentPayload()).toMatchObject({
      mode: "simple",
      contactPreference: "phone",
      phone: "+36 30 123 4567",
    });
  });
});
