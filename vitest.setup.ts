import "@testing-library/jest-dom/vitest";
import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

afterEach(() => {
  cleanup();
});

// Some test files opt into the "node" environment (e.g. to exercise SSR code
// paths where `window` is undefined), so guard all of this DOM setup.
if (typeof window !== "undefined") {
  // jsdom has no matchMedia implementation at all; always (re)install a working
  // stub rather than checking `"matchMedia" in window` first, since some
  // dependency may already have set an inert placeholder.
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    configurable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });

  class MockIntersectionObserver implements IntersectionObserver {
    readonly root: Element | Document | null = null;
    readonly rootMargin: string = "";
    readonly scrollMargin: string = "";
    readonly thresholds: ReadonlyArray<number> = [];
    constructor(_callback: IntersectionObserverCallback, _options?: IntersectionObserverInit) {}
    disconnect() {}
    observe() {}
    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }
    unobserve() {}
  }

  if (!("IntersectionObserver" in window)) {
    // @ts-expect-error - jsdom has no IntersectionObserver implementation
    window.IntersectionObserver = MockIntersectionObserver;
    // align global with window for code referencing the global directly
    globalThis.IntersectionObserver = MockIntersectionObserver;
  }

  // jsdom doesn't implement Element.prototype.scrollTo (only logs "Not
  // implemented" for window.scrollTo); components like useSnapCarousel call
  // it on plain scrollable <div>s, so stub it as a no-op.
  if (!Element.prototype.scrollTo) {
    Element.prototype.scrollTo = function scrollTo() {};
  }
}
