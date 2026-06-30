import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

type AboutProfileAvatarProps = {
  className?: string;
  alt?: string;
};

const ABOUT_AVATAR_URL = "/me.webp";

export function AboutProfileAvatar({ className, alt = "Profile avatar" }: AboutProfileAvatarProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div
      className={`relative mx-auto w-full max-w-70 sm:max-w-80 lg:justify-self-end ${className ?? ""}`}
    >
      <div className="absolute -inset-3 rounded-full bg-[conic-gradient(from_190deg,var(--color-secondary-warm),var(--color-secondary-hot),var(--color-secondary-warm))] opacity-75 blur-2xl" />
      <div className="absolute -inset-1 rounded-full bg-[conic-gradient(from_20deg,var(--color-secondary-hot),var(--color-secondary-warm),var(--color-secondary-hot))] opacity-85" />
      <div className="relative rounded-full border border-white/30 bg-black/20 p-1.5 shadow-[0_0_0_1px_rgba(255,255,255,0.08)_inset,0_30px_70px_-24px_var(--accent-glow)]">
        {isLoading ? (
          <Skeleton className="aspect-square w-full rounded-full border border-white/10 bg-white/10" />
        ) : null}
        <img
          src={ABOUT_AVATAR_URL}
          alt={alt}
          className={`aspect-square w-full rounded-full object-cover object-[center_18%] transition-opacity duration-300 ${
            isLoading ? "opacity-0" : "opacity-100"
          }`}
          loading="eager"
          decoding="async"
          onLoad={() => setIsLoading(false)}
          onError={() => setIsLoading(false)}
        />
      </div>
    </div>
  );
}
