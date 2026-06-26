import type { ReactNode } from "react";
import { ArrowRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

type ConversionCtaButtonProps = {
  href: string;
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
};

export function ConversionCtaButton({
  href,
  children,
  className,
  ariaLabel,
}: ConversionCtaButtonProps) {
  return (
    <Button
      asChild
      size="lg"
      className={`btn-cta group relative h-14 overflow-hidden rounded-[1.15rem] border border-white/15 px-8 text-sm font-extrabold tracking-[0.08em] text-[#140814] uppercase shadow-[0_18px_44px_-18px_var(--accent-glow)] ring-1 ring-white/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_54px_-18px_var(--accent-glow)] sm:h-15 sm:text-base ${className ?? ""}`}
    >
      <a href={href} aria-label={ariaLabel}>
        <span className="relative z-10 flex items-center justify-center gap-2">
          <span>{children}</span>
          <ArrowRightIcon className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
        </span>
        <span className="btn-cta-shine" aria-hidden="true" />
      </a>
    </Button>
  );
}
