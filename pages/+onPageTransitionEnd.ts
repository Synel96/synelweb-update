export async function onPageTransitionEnd() {
  // Keep the loader visible a bit longer in development to make animation testing easy.
  const MIN_LOADING_OVERLAY_MS = import.meta.env.DEV ? 700 : 0;
  const startedAt = Number(document.body.dataset.transitionStartedAt ?? 0);
  const elapsed = startedAt > 0 ? performance.now() - startedAt : MIN_LOADING_OVERLAY_MS;
  const remaining = Math.max(0, MIN_LOADING_OVERLAY_MS - elapsed);

  if (remaining > 0) {
    await new Promise((resolve) => setTimeout(resolve, remaining));
  }

  delete document.body.dataset.transitionStartedAt;
  document.body.classList.remove("page-transition");

  requestAnimationFrame(() => {
    document.body.classList.add("content-ready");
  });
}
