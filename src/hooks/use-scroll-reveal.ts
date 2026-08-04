import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/src/prefersReducedMotion";

/**
 * Arms an element for a one-time fade/slide-in reveal once it scrolls into
 * view, then disconnects. Classes are toggled imperatively on the DOM node
 * (not via React state) so the initial server-rendered markup stays fully
 * visible for no-JS/SEO crawlers; the "armed" (hidden) state only exists
 * once this effect runs on the client.
 */
export function useScrollReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || prefersReducedMotion()) return;

    element.classList.add("scroll-reveal-armed");

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        element.classList.add("scroll-reveal-visible");
        observer.disconnect();
      },
      { threshold: 0.3, rootMargin: "0px 0px -10% 0px" }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return ref;
}
