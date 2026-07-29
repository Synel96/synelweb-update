import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { ConversionCtaButton } from "@/components/ConversionCtaButton";
import { Button } from "@/components/ui/button";
import { useSnapCarousel } from "@/src/hooks/use-snap-carousel";
import { prefersReducedMotion } from "@/src/prefersReducedMotion";

type ServiceCardProps = {
  serviceName: string;
  description: string;
  regularPrice: string;
  discountedPrice: string;
  hasDiscount: boolean;
  discountLabel: string;
  expandLabel: string;
  collapseLabel: string;
  slug: string;
  images: string[];
  contactBaseHref: string;
  ctaLabel: string;
  ctaAriaLabel: string;
};

export function ServiceCard({
  serviceName,
  description,
  regularPrice,
  discountedPrice,
  hasDiscount,
  discountLabel,
  expandLabel,
  collapseLabel,
  slug,
  images,
  contactBaseHref,
  ctaLabel,
  ctaAriaLabel,
}: ServiceCardProps) {
  const COLLAPSED_DESCRIPTION_HEIGHT = 112;
  const EXPAND_SCROLL_OFFSET = 96;
  const slides = useMemo(() => images.filter((image) => image.trim().length > 0), [images]);
  const { scrollRef, activeIndex, scrollToIndex, prev, next, handleScroll } = useSnapCarousel(
    slides.length
  );
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const hasLongDescription = description.trim().length > 220;
  const articleRef = useRef<HTMLElement | null>(null);
  const descriptionRef = useRef<HTMLParagraphElement | null>(null);
  const [expandedHeight, setExpandedHeight] = useState(0);

  useEffect(() => {
    const element = descriptionRef.current;
    if (!element) return;
    setExpandedHeight(element.scrollHeight);
  }, [description]);

  useEffect(() => {
    if (!isDescriptionExpanded) return;

    const articleElement = articleRef.current;
    if (!articleElement) return;

    const scrollIntoComfortView = () => {
      const rect = articleElement.getBoundingClientRect();
      const targetTop = window.scrollY + rect.top - EXPAND_SCROLL_OFFSET;
      const currentTop = window.scrollY;

      if (Math.abs(targetTop - currentTop) < 12) return;

      window.scrollTo({
        top: Math.max(0, targetTop),
        behavior: prefersReducedMotion() ? "auto" : "smooth",
      });
    };

    const frameId = window.requestAnimationFrame(() => {
      window.setTimeout(scrollIntoComfortView, 140);
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [isDescriptionExpanded, expandedHeight]);

  const quoteHref = `${contactBaseHref}?service=${encodeURIComponent(slug)}`;

  return (
    <article
      ref={articleRef}
      className="flex flex-col self-start rounded-3xl border border-white/10 bg-[linear-gradient(155deg,rgba(16,22,42,0.9),rgba(12,18,33,0.95))] p-6 shadow-[0_22px_54px_-32px_var(--accent-glow)] sm:p-8"
    >
      <h3 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
        {serviceName}
      </h3>

      <div className="mt-4">
        <div
          className="overflow-hidden transition-[max-height] duration-400 ease-in-out"
          style={{
            maxHeight: hasLongDescription
              ? `${isDescriptionExpanded ? expandedHeight : COLLAPSED_DESCRIPTION_HEIGHT}px`
              : undefined,
          }}
        >
          <p ref={descriptionRef} className="text-sm leading-7 text-white/80 sm:text-base">
            {description}
          </p>
        </div>

        {hasLongDescription ? (
          <button
            type="button"
            className="mt-3 inline-flex items-center text-sm font-semibold tracking-[0.08em] text-(--accent) uppercase transition-opacity hover:opacity-80"
            onClick={() => setIsDescriptionExpanded((current) => !current)}
            aria-expanded={isDescriptionExpanded}
          >
            {isDescriptionExpanded ? collapseLabel : expandLabel}
          </button>
        ) : null}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        {hasDiscount ? (
          <>
            <span className="inline-flex items-center rounded-full border border-transparent bg-[linear-gradient(120deg,var(--color-secondary-warm),var(--color-secondary-hot)_62%,var(--color-secondary-warm))] px-3 py-1 text-[0.68rem] font-bold tracking-[0.18em] text-[#1a0a06] uppercase">
              {discountLabel}
            </span>
            <p className="text-sm font-semibold tracking-[0.08em] text-white/50 uppercase line-through decoration-white/45">
              {regularPrice}
            </p>
            <p className="text-lg font-extrabold tracking-[0.08em] text-emerald-300 uppercase sm:text-xl">
              {discountedPrice}
            </p>
          </>
        ) : (
          <p className="text-sm font-semibold tracking-[0.08em] text-emerald-400 uppercase">
            {regularPrice}
          </p>
        )}
      </div>

      {slides.length > 0 ? (
        <div className="mt-6 space-y-3">
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/25">
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              className="no-scrollbar flex touch-pan-y snap-x snap-mandatory overflow-x-auto scroll-smooth lg:touch-auto"
            >
              {slides.map((src, index) => (
                <div key={`${src}-${index}`} className="w-full shrink-0 snap-center">
                  <img
                    src={src}
                    alt={`${serviceName} image ${index + 1}`}
                    className="aspect-[16/10] w-full object-cover"
                    loading={index === 0 ? "eager" : "lazy"}
                    decoding="async"
                    crossOrigin="anonymous"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ))}
            </div>
          </div>

          {slides.length > 1 ? (
            <div className="flex items-center justify-between">
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={prev}
                className="rounded-full border border-white/20 bg-black/35 text-white hover:bg-black/55"
                aria-label="Previous image"
              >
                <ChevronLeftIcon className="size-4" />
              </Button>

              <div className="flex items-center gap-1.5">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`h-1.5 rounded-full transition-all ${
                      index === activeIndex
                        ? "w-5 bg-(--accent)"
                        : "w-2 bg-white/30 hover:bg-white/55"
                    }`}
                    onClick={() => scrollToIndex(index)}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>

              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={next}
                className="rounded-full border border-white/20 bg-black/35 text-white hover:bg-black/55"
                aria-label="Next image"
              >
                <ChevronRightIcon className="size-4" />
              </Button>
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="mt-auto pt-6">
        <ConversionCtaButton
          href={quoteHref}
          ariaLabel={ctaAriaLabel}
          className="h-auto min-h-12 w-full max-w-full px-5 py-3 text-center leading-tight whitespace-normal"
        >
          {ctaLabel}
        </ConversionCtaButton>
      </div>
    </article>
  );
}
