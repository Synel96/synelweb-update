import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import { renderWithI18n } from "../../test/render";

const { usePageContext } = vi.hoisted(() => ({ usePageContext: vi.fn() }));
vi.mock("vike-react/usePageContext", () => ({ usePageContext }));

const { runSiteCheck, trackEvent } = vi.hoisted(() => ({
  runSiteCheck: vi.fn(),
  trackEvent: vi.fn(),
}));
vi.mock("@/src/services/siteCheckService", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/src/services/siteCheckService")>();
  return { ...actual, runSiteCheck };
});
vi.mock("@/src/analytics", () => ({ trackEvent }));

import Page from "./+Page";
import { SiteCheckFailure, type SiteCheckResult } from "@/src/services/siteCheckService";

const RESULT: SiteCheckResult = {
  url: "https://pelda.hu",
  finalUrl: "https://www.pelda.hu/",
  strategy: "mobile",
  scores: { performance: 42, accessibility: 88, bestPractices: 96, seo: 91 },
  lab: [
    {
      id: "largest-contentful-paint",
      title: "Largest Contentful Paint",
      value: "5,2 s",
      score: 0.1,
    },
  ],
  field: [{ id: "lcp", percentile: 3400, category: "AVERAGE" }],
  opportunities: [
    {
      id: "render-blocking-resources",
      title: "Megjelenítést gátló erőforrások",
      savingsMs: 2100,
      value: "",
    },
  ],
};

function checkSite(url: string) {
  fireEvent.change(screen.getByPlaceholderText("pelda.hu"), { target: { value: url } });
  fireEvent.submit(screen.getByRole("button", { name: /Ellenőrzés/ }).closest("form")!);
}

describe("site check page", () => {
  beforeEach(() => {
    usePageContext.mockReturnValue({ lang: "hu" });
    Element.prototype.scrollIntoView = vi.fn();
  });
  afterEach(() => vi.clearAllMocks());

  it("checks a site on mobile and shows the scores, the wins and a quote link", async () => {
    runSiteCheck.mockResolvedValue(RESULT);
    await renderWithI18n(<Page />);

    checkSite("pelda.hu");

    expect(await screen.findByText("pelda.hu · Mobil")).toBeInTheDocument();
    expect(runSiteCheck).toHaveBeenCalledWith("pelda.hu", "mobile", "hu");
    expect(screen.getByText(/Sürgősen javítandó/)).toBeInTheDocument();
    expect(screen.getByText("Megjelenítést gátló erőforrások")).toBeInTheDocument();
    expect(screen.getByText("kb. 2,1 mp gyorsulás")).toBeInTheDocument();
    expect(screen.getByText("Javítandó")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Kérj ajánlatot/ })).toHaveAttribute(
      "href",
      "/hu/kapcsolat?site=https%3A%2F%2Fpelda.hu#ajanlatkeres"
    );
    expect(trackEvent).toHaveBeenCalledWith("site_check_start", {
      strategy: "mobile",
      trigger: "form",
    });
    expect(trackEvent).toHaveBeenCalledWith("site_check_run", {
      strategy: "mobile",
      result: "success",
    });
    // Kept for the quote form.
    expect(JSON.parse(sessionStorage.getItem("synelweb:site-check")!).result.url).toBe(
      "https://pelda.hu"
    );
    expect(screen.getByRole("button", { name: /PDF riport letöltése/ })).toBeInTheDocument();
  });

  it("explains a site that can't be loaded", async () => {
    runSiteCheck.mockRejectedValue(new SiteCheckFailure("unreachable"));
    await renderWithI18n(<Page />);

    checkSite("nincs-ilyen.hu");

    expect(await screen.findByRole("alert")).toHaveTextContent(/nem sikerült betölteni/);
    expect(trackEvent).toHaveBeenCalledWith("site_check_run", {
      strategy: "mobile",
      result: "error",
      reason: "unreachable",
    });
  });

  it("labels layout-shift wins and doesn't praise a weak page without listed wins", async () => {
    runSiteCheck.mockResolvedValue({
      ...RESULT,
      scores: { ...RESULT.scores, performance: 72 },
      opportunities: [
        {
          id: "cls-culprits-insight",
          title: "Layout shift culprits",
          savingsMs: 0,
          clsSavings: 0.38,
          value: "",
        },
      ],
    });
    await renderWithI18n(<Page />);
    checkSite("pelda.hu");
    expect(await screen.findByText("Kevesebb elrendezés-ugrálás (CLS)")).toBeInTheDocument();
  });

  it("only says 'nice work' when performance is 90+", async () => {
    runSiteCheck.mockResolvedValue({
      ...RESULT,
      scores: { ...RESULT.scores, performance: 72 },
      opportunities: [],
    });
    await renderWithI18n(<Page />);
    checkSite("pelda.hu");
    expect(await screen.findByText(/van mit javítani/)).toBeInTheDocument();
    expect(screen.queryByText(/szép munka/)).not.toBeInTheDocument();
  });

  it("lists the SEO basics and technical details, problems first", async () => {
    runSiteCheck.mockResolvedValue({
      ...RESULT,
      seo: {
        finalUrl: "https://www.pelda.hu/",
        clientRendered: true,
        checks: [
          { id: "h1", status: "pass", data: { count: 1 } },
          {
            id: "structuredData",
            status: "warn",
            data: { types: [], invalid: 0, hasBusiness: false },
          },
        ],
      },
      tech: [{ id: "fonts", status: "warn", data: { count: 7, kb: 210 } }],
    });
    await renderWithI18n(<Page />);

    checkSite("pelda.hu");

    expect(await screen.findByText("SEO-alapok")).toBeInTheDocument();
    expect(screen.getByText(/Nincs strukturált adat/)).toBeInTheDocument();
    expect(screen.getByText("Pontosan egy fő címsor van.")).toBeInTheDocument();
    expect(screen.getByText(/a böngésző rakja össze JavaScripttel/)).toBeInTheDocument();
    expect(screen.getByText("Technikai részletek")).toBeInTheDocument();
    expect(screen.getByText(/7 betűfájl \(210 kB\)/)).toBeInTheDocument();
    const labels = screen.getAllByText(/Strukturált adatok|H1 címsor/).map((el) => el.textContent);
    expect(labels[0]).toMatch(/Strukturált adatok/);
  });

  it("says so when the SEO basics couldn't be fetched", async () => {
    runSiteCheck.mockResolvedValue({ ...RESULT, seo: null, tech: [] });
    await renderWithI18n(<Page />);

    checkSite("pelda.hu");

    expect(await screen.findByText(/SEO-alapokat most nem sikerült lekérni/)).toBeInTheDocument();
    expect(screen.queryByText("Technikai részletek")).toBeNull();
  });
});
