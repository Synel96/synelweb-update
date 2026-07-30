import { describe, expect, it } from "vitest";
import lang from "./+lang";

describe("lang pageContext hook", () => {
  it("returns the pageContext's lang when set", () => {
    expect(lang({ lang: "de" })).toBe("de");
  });

  it("falls back to the default language when unset", () => {
    expect(lang({})).toBe("hu");
  });
});
