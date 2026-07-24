// https://vike.dev/onPageTransitionStart

import type { PageContextClient } from "vike/types";

const LOADER_APPEAR_DELAY_MS = 240;
const TRANSITION_LOADER_TIMER_KEY = "transitionLoaderTimer";

export async function onPageTransitionStart(_pageContext: Partial<PageContextClient>) {
  const existingTimerId = Number(document.body.dataset[TRANSITION_LOADER_TIMER_KEY] ?? 0);
  if (existingTimerId > 0) {
    clearTimeout(existingTimerId);
  }

  document.body.dataset.transitionStartedAt = String(performance.now());
  document.body.classList.remove("page-transition-show-loader");
  document.body.classList.add("page-transition");
  document.body.classList.add("content-animate");
  document.body.classList.remove("content-ready");

  const loaderTimerId = window.setTimeout(() => {
    // Only show the loader if the transition is still in progress.
    if (document.body.classList.contains("page-transition")) {
      document.body.classList.add("page-transition-show-loader");
    }
  }, LOADER_APPEAR_DELAY_MS);

  document.body.dataset[TRANSITION_LOADER_TIMER_KEY] = String(loaderTimerId);
}
