import { resolveApiBaseUrl } from "@/src/apiBaseUrl";
import { fetchWithTimeout } from "@/src/fetchWithTimeout";
import type { AppLang } from "@/src/services/serviceCardsService";

export type SiteCheckStrategy = "mobile" | "desktop";

export type SiteCheckResult = {
  url: string;
  finalUrl: string;
  strategy: SiteCheckStrategy;
  scores: {
    performance: number | null;
    accessibility: number | null;
    bestPractices: number | null;
    seo: number | null;
  };
  lab: Array<{ id: string; title: string; value: string; score: number | null }>;
  field: Array<{ id: "lcp" | "inp" | "cls"; percentile: number; category: string }>;
  // savingsMs: estimated loading time saved; clsSavings: layout shift
  // removed (CLS score). Either can be 0.
  opportunities: Array<{
    id: string;
    title: string;
    savingsMs: number;
    clsSavings?: number;
    value: string;
  }>;
  // The SEO basics read from the page's HTML (null when it couldn't be
  // fetched) and the technical details from the Lighthouse report. Missing
  // from checks made before these existed.
  seo?: {
    finalUrl: string;
    checks: AuditItem[];
    clientRendered: boolean;
    platform?: SitePlatform;
  } | null;
  tech?: AuditItem[];
};

export type AuditStatus = "pass" | "warn" | "fail" | "info";

// How the site was probably built (a guess from its source code).
export type SitePlatform = {
  builder: string | null;
  addons: string[];
  theme: string | null;
  frameworks: string[];
  kind: "builder" | "custom" | "unknown";
};

export type AuditItem = {
  id: string;
  status: AuditStatus;
  data: Record<string, number | string | boolean | string[]>;
};

// Why a check failed, for a matching message: the address is invalid, the
// site couldn't be loaded, too many checks, or Google/the server is busy.
export type SiteCheckError = "invalid" | "unreachable" | "throttled" | "busy";

export class SiteCheckFailure extends Error {
  constructor(public readonly reason: SiteCheckError) {
    super(reason);
  }
}

// A Lighthouse run takes 15-40 seconds; give it room.
const TIMEOUT_MS = 90_000;

export async function runSiteCheck(
  url: string,
  strategy: SiteCheckStrategy,
  lang: AppLang
): Promise<SiteCheckResult> {
  let response: Response;
  try {
    response = await fetchWithTimeout(
      `${resolveApiBaseUrl()}/api/site-check/`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ url, strategy, lang }),
      },
      TIMEOUT_MS
    );
  } catch {
    throw new SiteCheckFailure("busy");
  }

  if (response.ok) return (await response.json()) as SiteCheckResult;
  if (response.status === 400) throw new SiteCheckFailure("invalid");
  if (response.status === 422) throw new SiteCheckFailure("unreachable");
  if (response.status === 429) throw new SiteCheckFailure("throttled");
  throw new SiteCheckFailure("busy");
}
