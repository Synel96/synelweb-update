import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { LighthouseScoreRing } from "./LighthouseScoreRing";

let observedCallback: IntersectionObserverCallback | null = null;
let disconnectSpy: ReturnType<typeof vi.fn>;

beforeEach(() => {
  disconnectSpy = vi.fn();
  observedCallback = null;

  class TestIntersectionObserver {
    constructor(callback: IntersectionObserverCallback) {
      observedCallback = callback;
    }
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = disconnectSpy;
    takeRecords = () => [];
    root = null;
    rootMargin = "";
    thresholds = [];
  }

  vi.stubGlobal("IntersectionObserver", TestIntersectionObserver);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

function triggerIntersection(isIntersecting: boolean) {
  observedCallback?.([{ isIntersecting } as IntersectionObserverEntry], {} as IntersectionObserver);
}

describe("LighthouseScoreRing", () => {
  it("renders the label and starts the visual counter at 0", () => {
    render(<LighthouseScoreRing label="Performance" score={92} />);
    expect(screen.getByText("Performance")).toBeInTheDocument();
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("does not animate before the ring intersects the viewport", () => {
    render(<LighthouseScoreRing label="Performance" score={92} />);
    triggerIntersection(false);
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("animates to the clamped score once the ring becomes visible", async () => {
    render(<LighthouseScoreRing label="Performance" score={92} />);
    triggerIntersection(true);
    // The component defers the update through two nested requestAnimationFrame
    // calls, so the DOM update happens a couple of frames after the callback fires.
    expect(await screen.findByText("92")).toBeInTheDocument();
  });

  it("clamps a score above 100 down to 100", async () => {
    render(<LighthouseScoreRing label="SEO" score={140} />);
    triggerIntersection(true);
    expect(await screen.findByText("100")).toBeInTheDocument();
  });

  it("clamps a negative score up to 0", () => {
    render(<LighthouseScoreRing label="SEO" score={-10} />);
    triggerIntersection(true);
    // Already 0 both before and after animating, so no need to await a frame.
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("disconnects the observer once it has animated, and ignores further intersections", async () => {
    render(<LighthouseScoreRing label="Performance" score={92} />);
    triggerIntersection(true);
    expect(disconnectSpy).toHaveBeenCalledTimes(1);

    triggerIntersection(true);
    expect(await screen.findByText("92")).toBeInTheDocument();
  });
});
