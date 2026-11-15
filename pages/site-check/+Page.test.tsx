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
    expect(screen.getByRole("link", { name: /Kérek ajánlatot/ })).toHaveAttribute(
      "href",
      "/hu/kapcsolat?site=https%3A%2F%2Fpelda.hu#ajanlatkeres"
    );
    expect(trackEvent).toHaveBeenCalledWith("site_check_run", {
      strategy: "mobile",
      result: "success",
    });
  });

  it("explains a site that can't be loaded", async () => {
    runSiteCheck.mockRejectedValue(new SiteCheckFailure("unreachable"));
    await renderWithI18n(<Page />);

    checkSite("nincs-ilyen.hu");

    expect(await screen.findByRole("alert")).toHaveTextContent(/nem sikerült betölteni/);
  });
});
