import { useMemo, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { ConversionCtaButton } from "@/components/ConversionCtaButton";
import { Button } from "@/components/ui/button";

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
  const slides = useMemo(() => images.filter((image) => image.trim().length > 0), [images]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const hasLongDescription = description.trim().length > 220;

  const prev = () =>
    setActiveIndex((prevIndex) =>
      prevIndex === 0 ? Math.max(slides.length - 1, 0) : prevIndex - 1
    );
  const next = () =>
    setActiveIndex((prevIndex) =>
      prevIndex === Math.max(slides.length - 1, 0) ? 0 : prevIndex + 1
    );

  const quoteHref = `${contactBaseHref}?service=${encodeURIComponent(slug)}`;

  return (
    <article className="flex h-full flex-col rounded-3xl border border-white/10 bg-[linear-gradient(155deg,rgba(16,22,42,0.9),rgba(12,18,33,0.95))] p-6 shadow-[0_22px_54px_-32px_var(--accent-glow)] sm:p-8">
      <h3 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
        {serviceName}
      </h3>

      <div className="mt-4 min-h-[8.5rem]">
        <p
          className={`text-sm leading-7 text-white/80 sm:text-base ${
            !isDescriptionExpanded && hasLongDescription ? "line-clamp-4" : ""
          }`}
        >
          {description}
        </p>

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
            <span className="inline-flex items-center rounded-full border border-amber-300/35 bg-amber-300/12 px-3 py-1 text-[0.68rem] font-bold tracking-[0.18em] text-amber-200 uppercase">
              {discountLabel}
            </span>
            <p className="text-sm font-semibold tracking-[0.08em] text-white/50 line-through decoration-white/45 uppercase">
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
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {slides.map((src, index) => (
                <div key={`${src}-${index}`} className="w-full shrink-0">
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

            {slides.length > 1 ? (
              <>
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={prev}
                    className="pointer-events-auto rounded-full border border-white/20 bg-black/45 text-white hover:bg-black/65"
                    aria-label="Previous image"
                  >
                    <ChevronLeftIcon className="size-4" />
                  </Button>
                </div>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={next}
                    className="pointer-events-auto rounded-full border border-white/20 bg-black/45 text-white hover:bg-black/65"
                    aria-label="Next image"
                  >
                    <ChevronRightIcon className="size-4" />
                  </Button>
                </div>
              </>
            ) : null}
          </div>

          {slides.length > 1 ? (
            <div className="flex items-center justify-center gap-1.5">
              {slides.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  className={`h-1.5 rounded-full transition-all ${
                    index === activeIndex
                      ? "w-5 bg-(--accent)"
                      : "w-2 bg-white/30 hover:bg-white/55"
                  }`}
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
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
