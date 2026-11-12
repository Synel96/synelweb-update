import { describe, expect, it } from "vitest";
import { strongestFirst } from "./use-certificates";
import type { Certificate } from "@/src/services/certificatesService";

const cert = (id: number, kind: "exam" | "course", issuedOn: string) =>
  ({ id, kind, issuedOn, title: `C${id}` }) as unknown as Certificate;

describe("strongestFirst", () => {
  it("puts exam-based certificates before courses, newest first within each", () => {
    const sorted = strongestFirst([
      cert(1, "course", "2026-11-09"),
      cert(2, "exam", "2025-05-13"),
      cert(3, "course", "2025-05-26"),
      cert(4, "exam", "2026-11-08"),
    ]);
    expect(sorted.map((c) => c.id)).toEqual([4, 2, 1, 3]);
  });
});
