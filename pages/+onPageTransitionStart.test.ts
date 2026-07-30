import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { onPageTransitionStart } from "./+onPageTransitionStart";

beforeEach(() => {
  vi.useFakeTimers();
  document.body.className = "";
  delete document.body.dataset.transitionStartedAt;
  delete document.body.dataset.transitionLoaderTimer;
});

afterEach(() => {
  vi.useRealTimers();
});

describe("onPageTransitionStart", () => {
  it("adds the transition/animate classes and removes content-ready", async () => {
    document.body.classList.add("content-ready");
    await onPageTransitionStart({});

    expect(document.body.classList.contains("page-transition")).toBe(true);
    expect(document.body.classList.contains("content-animate")).toBe(true);
    expect(document.body.classList.contains("content-ready")).toBe(false);
    expect(document.body.classList.contains("page-transition-show-loader")).toBe(false);
  });

  it("records a transitionStartedAt timestamp", async () => {
    await onPageTransitionStart({});
    expect(document.body.dataset.transitionStartedAt).toBeDefined();
    expect(Number(document.body.dataset.transitionStartedAt)).not.toBeNaN();
  });

  it("shows the loader class only after the appear delay if still transitioning", async () => {
    await onPageTransitionStart({});
    expect(document.body.classList.contains("page-transition-show-loader")).toBe(false);

    vi.advanceTimersByTime(240);
    expect(document.body.classList.contains("page-transition-show-loader")).toBe(true);
  });

  it("does not show the loader if the transition already ended before the delay fires", async () => {
    await onPageTransitionStart({});
    document.body.classList.remove("page-transition");

    vi.advanceTimersByTime(240);
    expect(document.body.classList.contains("page-transition-show-loader")).toBe(false);
  });

  it("clears a pending loader timer from a previous transition when called again", async () => {
    await onPageTransitionStart({});
    const firstTimerId = document.body.dataset.transitionLoaderTimer;

    await onPageTransitionStart({});
    const secondTimerId = document.body.dataset.transitionLoaderTimer;

    expect(secondTimerId).not.toBe(firstTimerId);

    // Only one loader-show should fire even though two timers were scheduled.
    vi.advanceTimersByTime(240);
    expect(document.body.classList.contains("page-transition-show-loader")).toBe(true);
  });
});
