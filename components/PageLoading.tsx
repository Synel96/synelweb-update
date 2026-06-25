import { useState } from "react";

import logoUrl from "../assets/logo.svg";
import { BRAND_NAME } from "./site";

export function PageLoading() {
  const [logoError, setLogoError] = useState(false);

  return (
    <div
      aria-hidden="true"
      className="page-loading-overlay fixed inset-0 z-50 flex items-center justify-center bg-(--brand-surface) text-(--brand-on-surface) opacity-0 transition-opacity duration-300"
    >
      <div className="flex flex-col items-center gap-4">
        <div className="page-loading-spinner relative size-14">
          <span className="absolute inset-0 rounded-full border-2 border-white/15" />
          <span className="absolute inset-0 animate-spin rounded-full border-2 border-t-white border-r-white/40 border-b-transparent border-l-transparent" />
        </div>

        {logoError ? (
          <span className="text-sm font-medium tracking-[0.2em] text-white/80 uppercase">
            {BRAND_NAME}
          </span>
        ) : (
          <img
            src={logoUrl}
            alt={BRAND_NAME}
            width="48"
            height="48"
            className="size-12 object-contain"
            onError={() => setLogoError(true)}
          />
        )}
      </div>
    </div>
  );
}
