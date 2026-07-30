import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { onPageTransitionEnd } from "./+onPageTransitionEnd";

beforeEach(() => {
  vi.useFakeTimers();
  document.body.className = "";
  document.body.classList.add("page-transition", "content-animate");
  delete document.body.dataset.transitionStartedAt;
  delete document.body.dataset.transitionLoaderTimer;
  sessionStorage.clear();
  vi.stubEnv("DEV", false);
  // jsdom logs a noisy "Not implemented" console warning for a real scrollTo
  // call; stub it by default so tests that don't care about it stay quiet.
  vi.spyOn(window, "scrollTo").mockImplementation(() => {});
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllEnvs();
});

describe("onPageTransitionEnd", () => {
  it("removes the transition classes and marks content ready when there is no recorded start time", async () => {
    const promise = onPageTransitionEnd();
    await vi.runAllTimersAsync();
    await promise;

    expect(document.body.classList.contains("page-transition")).toBe(false);
    expect(document.body.classList.contains("page-transition-show-loader")).toBe(false);
    expect(document.body.classList.contains("content-ready")).toBe(true);
  });

  it("clears a pending loader-show timer left over from the transition start", async () => {
    document.body.classList.add("page-transition-show-loader");
    const clearTimeoutSpy = vi.spyOn(global, "clearTimeout");
    document.body.dataset.transitionLoaderTimer = "123456";

    const promise = onPageTransitionEnd();
    await vi.runAllTimersAsync();
    await promise;

    expect(clearTimeoutSpy).toHaveBeenCalledWith(123456);
    expect(document.body.dataset.transitionLoaderTimer).toBeUndefined();
    expect(document.body.dataset.transitionStartedAt).toBeUndefined();
  });

  // Note: import.meta.env.DEV is inlined at transform time, so vi.stubEnv can't
  // flip it at runtime for an already-imported module — the dev-only minimum
  // overlay duration (MIN_LOADING_OVERLAY_MS) isn't asserted here for that reason.

  it("resolves promptly when a start time was recorded (no artificial delay in prod mode)", async () => {
    document.body.dataset.transitionStartedAt = String(performance.now());

    let resolved = false;
    const promise = onPageTransitionEnd().then(() => {
      resolved = true;
    });

    await vi.runAllTimersAsync();
    await promise;
    expect(resolved).toBe(true);
  });

  it("restores and clears a preserved scroll position", async () => {
    sessionStorage.setItem("synelweb:preserve-scroll-y", "420");
    const scrollToSpy = vi.spyOn(window, "scrollTo").mockImplementation(() => {});

    const promise = onPageTransitionEnd();
    await vi.runAllTimersAsync();
    await promise;

    expect(scrollToSpy).toHaveBeenCalledWith({ top: 420, behavior: "auto" });
    expect(sessionStorage.getItem("synelweb:preserve-scroll-y")).toBeNull();
  });

  it("does not call scrollTo when there is no preserved scroll position", async () => {
    const scrollToSpy = vi.spyOn(window, "scrollTo").mockImplementation(() => {});

    const promise = onPageTransitionEnd();
    await vi.runAllTimersAsync();
    await promise;

    expect(scrollToSpy).not.toHaveBeenCalled();
  });

  it("clears a garbage (non-numeric) stored value without calling scrollTo", async () => {
    sessionStorage.setItem("synelweb:preserve-scroll-y", "not-a-number");
    const scrollToSpy = vi.spyOn(window, "scrollTo").mockImplementation(() => {});

    const promise = onPageTransitionEnd();
    await vi.runAllTimersAsync();
    await promise;

    expect(scrollToSpy).not.toHaveBeenCalled();
    expect(sessionStorage.getItem("synelweb:preserve-scroll-y")).toBeNull();
  });

  it("clamps a negative preserved scroll position to 0", async () => {
    sessionStorage.setItem("synelweb:preserve-scroll-y", "-50");
    const scrollToSpy = vi.spyOn(window, "scrollTo").mockImplementation(() => {});

    const promise = onPageTransitionEnd();
    await vi.runAllTimersAsync();
    await promise;

    expect(scrollToSpy).toHaveBeenCalledWith({ top: 0, behavior: "auto" });
  });
});
