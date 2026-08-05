import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchWithTimeout } from "./fetchWithTimeout";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe("fetchWithTimeout", () => {
  it("resolves normally when the request finishes before the timeout", async () => {
    const response = { ok: true } as Response;
    const fetchMock = vi.fn().mockResolvedValue(response);
    vi.stubGlobal("fetch", fetchMock);

    const result = await fetchWithTimeout("https://example.com/data");

    expect(result).toBe(response);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://example.com/data",
      expect.objectContaining({ signal: expect.any(AbortSignal) })
    );
  });

  it("aborts the request once the timeout elapses", async () => {
    vi.useFakeTimers();

    const fetchMock = vi.fn(
      (_input: string, init?: RequestInit) =>
        new Promise((_resolve, reject) => {
          init?.signal?.addEventListener("abort", () => {
            reject(new DOMException("Aborted", "AbortError"));
          });
        })
    );
    vi.stubGlobal("fetch", fetchMock);

    const pending = fetchWithTimeout("https://example.com/slow", {}, 5000);
    const assertion = expect(pending).rejects.toThrow();

    await vi.advanceTimersByTimeAsync(5000);
    await assertion;
  });

  it("passes a custom timeout through instead of the default", async () => {
    vi.useFakeTimers();

    const fetchMock = vi.fn(
      (_input: string, init?: RequestInit) =>
        new Promise((_resolve, reject) => {
          init?.signal?.addEventListener("abort", () => {
            reject(new DOMException("Aborted", "AbortError"));
          });
        })
    );
    vi.stubGlobal("fetch", fetchMock);

    const pending = fetchWithTimeout("https://example.com/slow", {}, 1000);
    const assertion = expect(pending).rejects.toThrow();

    await vi.advanceTimersByTimeAsync(1000);
    await assertion;
  });
});
