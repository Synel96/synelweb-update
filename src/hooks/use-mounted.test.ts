import { describe, expect, it } from "vitest";
import { renderHook } from "@testing-library/react";
import { useMounted } from "./use-mounted";

describe("useMounted", () => {
  it("reports true once mounted (after the effect has flushed)", () => {
    const { result } = renderHook(() => useMounted());
    expect(result.current).toBe(true);
  });
});
