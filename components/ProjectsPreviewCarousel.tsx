import { useMemo } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  cloudinarySizedImageUrl,
  isCloudinaryImageUrl,
  withCloudinaryAutoParams,
} from "@/src/cloudinary";
import { useSnapCarousel } from "@/src/hooks/use-snap-carousel";

type ProjectPreview = {
  id: string;
  name: string;
  previewImage: string;
};

type ProjectsPreviewCarouselProps = {
  projects: ProjectPreview[];
  prevAriaLabel: string;
  nextAriaLabel: string;
  goToAriaLabel: (index: number) => string;
};

export function ProjectsPreviewCarousel({
  projects,
  prevAriaLabel,
  nextAriaLabel,
  goToAriaLabel,
}: ProjectsPreviewCarouselProps) {
  const slides = useMemo(
    () =>
      projects
        .filter((project) => project.previewImage.trim().length > 0)
        .map((project) => {
          const normalized = withCloudinaryAutoParams(project.previewImage);
          if (!isCloudinaryImageUrl(normalized)) {
            return {
              ...project,
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
            ...project,
            src: cloudinarySizedImageUrl(normalized, 1024),
            srcSet,
            sizes: "(max-width: 640px) 92vw, (max-width: 1024px) 86vw, 620px",
          };
        }),
    [projects]
  );

  const { scrollRef, activeIndex, scrollToIndex, prev, next, handleScroll } = useSnapCarousel(
    slides.length
  );

  if (slides.length === 0) return null;

  return (
    <div className="mt-6 space-y-3">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth"
      >
        {slides.map((slide) => (
          <div key={slide.id} className="w-full shrink-0 snap-center">
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/25">
              <img
                src={slide.src}
                srcSet={slide.srcSet}
                sizes={slide.sizes}
                alt={slide.name}
                className="aspect-[16/9] w-full object-cover lg:aspect-[21/9]"
                loading="lazy"
                decoding="async"
                crossOrigin="anonymous"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-10">
                <p className="text-sm font-semibold text-white sm:text-base">{slide.name}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {slides.length > 1 ? (
        <div className="flex items-center justify-between">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={prev}
            className="rounded-full border border-white/20 bg-black/35 text-white hover:bg-black/55"
            aria-label={prevAriaLabel}
          >
            <ChevronLeftIcon className="size-4" />
          </Button>

          <div className="flex items-center gap-1.5">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                className={`h-1.5 rounded-full transition-all ${
                  index === activeIndex ? "w-5 bg-(--accent)" : "w-2 bg-white/30 hover:bg-white/55"
                }`}
                onClick={() => scrollToIndex(index)}
                aria-label={goToAriaLabel(index + 1)}
              />
            ))}
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={next}
            className="rounded-full border border-white/20 bg-black/35 text-white hover:bg-black/55"
            aria-label={nextAriaLabel}
          >
            <ChevronRightIcon className="size-4" />
          </Button>
        </div>
      ) : null}
    </div>
  );
}
