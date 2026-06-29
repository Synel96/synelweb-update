import { BRAND_NAME } from "./site";

export function PageLoading() {
  return (
    <div
      aria-hidden="true"
      className="page-loading-overlay fixed inset-0 z-50 flex items-center justify-center bg-(--brand-surface) text-(--brand-on-surface) opacity-0 transition-opacity duration-300"
    >
      <div className="page-loading-spinner relative flex size-44 items-center justify-center sm:size-52">
        <span className="page-loading-ring" />
        <span className="page-loading-ring-glow" />
        <span className="page-loading-ring-trail" />
        <span className="brand-tech text-lg font-semibold tracking-[0.22em] text-white/90 uppercase sm:text-xl">
          {BRAND_NAME}
        </span>
      </div>
    </div>
  );
}
