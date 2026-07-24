const SCROLL_RESTORE_KEY = "synelweb:preserve-scroll-y";
const TRANSITION_LOADER_TIMER_KEY = "transitionLoaderTimer";

export async function onPageTransitionEnd() {
  // Keep the loader visible a bit longer in development to make animation testing easy.
  const MIN_LOADING_OVERLAY_MS = import.meta.env.DEV ? 700 : 0;
  const startedAt = Number(document.body.dataset.transitionStartedAt ?? 0);
  const elapsed = startedAt > 0 ? performance.now() - startedAt : MIN_LOADING_OVERLAY_MS;
  const remaining = Math.max(0, MIN_LOADING_OVERLAY_MS - elapsed);

  if (remaining > 0) {
    await new Promise((resolve) => setTimeout(resolve, remaining));
  }

  const loaderTimerId = Number(document.body.dataset[TRANSITION_LOADER_TIMER_KEY] ?? 0);
  if (loaderTimerId > 0) {
    clearTimeout(loaderTimerId);
  }

  delete document.body.dataset.transitionStartedAt;
  delete document.body.dataset[TRANSITION_LOADER_TIMER_KEY];
  document.body.classList.remove("page-transition-show-loader");
  document.body.classList.remove("page-transition");

  requestAnimationFrame(() => {
    document.body.classList.add("content-ready");
  });

  const preservedScrollY = Number(sessionStorage.getItem(SCROLL_RESTORE_KEY));
  if (!Number.isNaN(preservedScrollY)) {
    window.scrollTo({ top: Math.max(0, preservedScrollY), behavior: "auto" });
    sessionStorage.removeItem(SCROLL_RESTORE_KEY);
  }
}
