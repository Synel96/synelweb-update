import type { ReactNode } from "react";
import { ArrowRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

type ConversionCtaButtonProps = {
  href: string;
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
  onClick?: () => void;
};

// The button draws its own arrow icon, so drop a trailing "→" a label may
// still carry (labels are shared with plain text links that do show one).
function withoutTrailingArrow(children: ReactNode): ReactNode {
  return typeof children === "string" ? children.replace(/\s*→\s*$/, "") : children;
}

// On phones the label may wrap onto two lines and the button never grows
// wider than its container: unwrapped, longer labels (and the German ones
// especially) pushed it out of the cards it sits in.
export function ConversionCtaButton({
  href,
  children,
  className,
  ariaLabel,
  onClick,
}: ConversionCtaButtonProps) {
  return (
    <Button
      asChild
      size="lg"
      className={`btn-cta group relative h-auto min-h-14 max-w-full overflow-hidden rounded-[1.15rem] border border-white/15 px-6 py-3 text-center text-sm leading-tight font-extrabold tracking-[0.08em] whitespace-normal text-[#140814] uppercase shadow-[0_18px_44px_-18px_var(--accent-glow)] ring-1 ring-white/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_54px_-18px_var(--accent-glow)] sm:min-h-15 sm:px-8 sm:text-base sm:whitespace-nowrap ${className ?? ""}`}
    >
      <a href={href} aria-label={ariaLabel} onClick={onClick}>
        <span className="relative z-10 flex items-center justify-center gap-2">
          <span>{withoutTrailingArrow(children)}</span>
          <ArrowRightIcon className="size-4 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5" />
        </span>
        <span className="btn-cta-shine" aria-hidden="true" />
      </a>
    </Button>
  );
}
