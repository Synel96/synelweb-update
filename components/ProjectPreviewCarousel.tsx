import { useMemo } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  cloudinarySizedImageUrl,
  isCloudinaryImageUrl,
  withCloudinaryAutoParams,
} from "@/src/cloudinary";
import { useSnapCarousel } from "@/src/hooks/use-snap-carousel";

type ProjectPreviewCarouselProps = {
  previewImage: string;
  otherImages: string[];
  title: string;
  prioritize?: boolean;
  previewAlt?: (index: number) => string;
};

export function ProjectPreviewCarousel({
  previewImage,
  otherImages,
  title,
  prioritize = false,
  previewAlt = (index) => `${title} preview ${index}`,
}: ProjectPreviewCarouselProps) {
  const slides = useMemo(() => {
    const rawSlides = [previewImage, ...otherImages].filter((src) => src.trim().length > 0);
    return rawSlides.map((src) => {
      const normalized = withCloudinaryAutoParams(src);
      if (!isCloudinaryImageUrl(normalized)) {
        return {
          src: normalized,
          srcSet: undefined as string | undefined,
          sizes: undefined as string | undefined,
        };
      }

      const widths = [480, 768, 1024, 1360];
      const srcSet = widths
        .map((width) => `${cloudinarySizedImageUrl(normalized, width)} ${width}w`)
        .join(", ");

      return {
        src: cloudinarySizedImageUrl(normalized, 1024),
        srcSet,
        sizes: "(max-width: 640px) 92vw, (max-width: 1024px) 86vw, (max-width: 1280px) 52vw, 620px",
      };
    });
  }, [previewImage, otherImages]);
  const { scrollRef, activeIndex, scrollToIndex, prev, next, handleScroll } = useSnapCarousel(
    slides.length
  );

  if (slides.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-black/20 p-8 text-center text-sm text-white/70">
        {title}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/25">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto scroll-smooth"
        >
          {slides.map((slide, index) => (
            <div key={`${slide.src}-${index}`} className="w-full shrink-0 snap-center">
              <img
                src={slide.src}
                srcSet={slide.srcSet}
                sizes={slide.sizes}
                alt={previewAlt(index + 1)}
                className="aspect-[16/9] w-full object-cover lg:aspect-[6/5]"
                loading={prioritize && index === 0 ? "eager" : "lazy"}
                decoding="async"
                fetchPriority={prioritize && index === 0 ? "high" : "auto"}
                crossOrigin="anonymous"
                referrerPolicy="no-referrer"
              />
            </div>
          ))}
        </div>
      </div>

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
                index === activeIndex ? "w-5 bg-(--accent)" : "w-2 bg-white/30 hover:bg-white/55"
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
    </div>
  );
}
