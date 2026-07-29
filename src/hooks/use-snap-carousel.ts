import { useCallback, useRef, useState } from "react";

export function useSnapCarousel(slideCount: number) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollToIndex = useCallback((index: number) => {
    const element = scrollRef.current;
    if (!element) return;
    element.scrollTo({ left: index * element.clientWidth, behavior: "smooth" });
  }, []);

  const prev = useCallback(() => {
    scrollToIndex(activeIndex === 0 ? Math.max(slideCount - 1, 0) : activeIndex - 1);
  }, [activeIndex, slideCount, scrollToIndex]);

  const next = useCallback(() => {
    scrollToIndex(activeIndex === Math.max(slideCount - 1, 0) ? 0 : activeIndex + 1);
  }, [activeIndex, slideCount, scrollToIndex]);

  const handleScroll = useCallback(() => {
    const element = scrollRef.current;
    if (!element || element.clientWidth === 0) return;
    const index = Math.round(element.scrollLeft / element.clientWidth);
    setActiveIndex((current) => (current === index ? current : index));
  }, []);

  return { scrollRef, activeIndex, scrollToIndex, prev, next, handleScroll };
}
