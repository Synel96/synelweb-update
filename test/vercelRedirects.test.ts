import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  KNOWN_LOGICAL_PATHS,
  isLegalLogicalPath,
  isRegionalLogicalPath,
  localizePath,
  resolveLanguageAndLogicalPath,
} from "../src/localizedRoutes";

const isPage = (logicalPath: string) =>
  (KNOWN_LOGICAL_PATHS as readonly string[]).includes(logicalPath) ||
  isRegionalLogicalPath(logicalPath) ||
  isLegalLogicalPath(logicalPath);

type Redirect = { source: string; destination: string; permanent?: boolean };

const vercelConfig = JSON.parse(readFileSync(resolve(__dirname, "..", "vercel.json"), "utf8")) as {
  redirects: Redirect[];
};

const redirects = vercelConfig.redirects;
const destinationOf = (source: string) => redirects.find((rule) => rule.source === source)?.destination;

// Addresses of earlier versions of synelweb.hu that Google still has (Search
// Console, Nov 2026). Without a redirect they were 404s, and whatever ranking
// they had was lost.
const OLD_ADDRESSES = [
  "/szolgaltatasok",
  "/elerhetoseg",
  "/projektek",
  "/rolam",
  "/velemenyek",
  "/hu/elerhetoseg",
  "/hu/velemenyek",
  "/hu/contact",
  "/hu/about",
  "/hu/services",
  "/hu/projects",
  "/hu/technology",
  "/hu/certificates",
];

describe("vercel.json redirects", () => {
  it("send every old address, with or without a trailing slash, somewhere permanently", () => {
    for (const address of OLD_ADDRESSES) {
      for (const source of [address, `${address}/`]) {
        const rule = redirects.find((r) => r.source === source);
        expect(rule, `no redirect for ${source}`).toBeDefined();
        expect(rule!.permanent, source).toBe(true);
      }
    }
  });

  it("only send old addresses to pages that exist, at their current address", () => {
    const plain = redirects.filter((rule) => !rule.source.includes(":") && rule.destination.startsWith("/"));
    for (const rule of plain) {
      const path = rule.destination.split("#")[0];
      const { lang, logicalPath } = resolveLanguageAndLogicalPath(path);
      expect(isPage(logicalPath), `${rule.source} -> ${rule.destination}`).toBe(true);
      expect(localizePath(logicalPath, lang), `${rule.source} -> ${rule.destination}`).toBe(path);
    }
  });

  it("keep the unprefixed copies of one-language pages off search results", () => {
    expect(destinationOf("/sopron")).toBe("/hu/weboldal-keszites-sopron");
    expect(destinationOf("/austria")).toBe("/de/webdesign-burgenland-wien");
    expect(destinationOf("/google-ads")).toBe("/hu/google-ads-kezeles");
    expect(destinationOf("/site-check")).toBe("/hu/weboldal-ellenorzes");
  });

  it("have no source twice", () => {
    const sources = redirects.map((rule) => rule.source);
    expect(new Set(sources).size).toBe(sources.length);
  });
});
