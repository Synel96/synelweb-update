import { useMemo, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

type ProjectPreviewCarouselProps = {
  previewImage: string;
  otherImages: string[];
  title: string;
};

export function ProjectPreviewCarousel({
  previewImage,
  otherImages,
  title,
}: ProjectPreviewCarouselProps) {
  const slides = useMemo(() => [previewImage, ...otherImages], [previewImage, otherImages]);
  const [activeIndex, setActiveIndex] = useState(0);

  const prev = () => setActiveIndex((prevIndex) => (prevIndex === 0 ? slides.length - 1 : prevIndex - 1));
  const next = () => setActiveIndex((prevIndex) => (prevIndex === slides.length - 1 ? 0 : prevIndex + 1));

  return (
    <div className="space-y-3">
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/25">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {slides.map((src, index) => (
            <div key={`${src}-${index}`} className="w-full shrink-0">
              <img
                src={src}
                alt={`${title} preview ${index + 1}`}
                className="aspect-[16/10] w-full object-cover"
                loading={index === 0 ? "eager" : "lazy"}
                decoding="async"
              />
            </div>
          ))}
        </div>

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
      </div>

      <div className="flex items-center justify-center gap-1.5">
        {slides.map((_, index) => (
          <button
            key={index}
            type="button"
            className={`h-1.5 rounded-full transition-all ${
              index === activeIndex ? "w-5 bg-(--accent)" : "w-2 bg-white/30 hover:bg-white/55"
            }`}
            onClick={() => setActiveIndex(index)}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}