// https://vike.dev/onPageTransitionStart

import type { PageContextClient } from "vike/types";

export async function onPageTransitionStart(_pageContext: Partial<PageContextClient>) {
  document.body.dataset.transitionStartedAt = String(performance.now());
  document.body.classList.add("page-transition");
  document.body.classList.add("content-animate");
  document.body.classList.remove("content-ready");
}
