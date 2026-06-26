export async function onPageTransitionEnd() {
  document.body.classList.remove("page-transition");

  requestAnimationFrame(() => {
    document.body.classList.add("content-ready");
  });
}
