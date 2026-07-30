import { describe, expect, it } from "vitest";
import { DEFAULT_LANG, SUPPORTED_LANGS } from "./i18n-config";

describe("i18n-config", () => {
  it("defines the three supported languages", () => {
    expect(SUPPORTED_LANGS).toEqual(["en", "hu", "de"]);
  });

  it("defaults to Hungarian", () => {
    expect(DEFAULT_LANG).toBe("hu");
    expect(SUPPORTED_LANGS).toContain(DEFAULT_LANG);
  });
});
