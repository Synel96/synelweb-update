import { useEffect } from "react";
import { Footer } from "../components/Footer";
import { I18nProvider } from "../components/I18nProvider";
import { Navbar } from "../components/Navbar";
import { PageLoading } from "../components/PageLoading";
import { useTranslation } from "react-i18next";
import { usePageContext } from "vike-react/usePageContext";

// Shared across the app lifetime so both effects below wait on the same
// one-time setup instead of racing each other (dynamic import() of the same
// module is deduped, so calling it again here is cheap).
let contentRevealReadyPromise: Promise<void> | null = null;

function ensureContentRevealReady(): Promise<void> {
  if (!contentRevealReadyPromise) {
    // Defer non-critical animation CSS so it doesn't block first paint,
    // then flip the body classes once styles are available.
    contentRevealReadyPromise = import("./Layout.noncritical.css").then(
      () =>
        new Promise<void>((resolve) => {
          document.body.classList.add("content-animate");
          document.body.classList.remove("content-ready");

          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              document.body.classList.add("content-ready");
              resolve();
            });
          });
        })
    );
  }

  return contentRevealReadyPromise;
}

function LayoutInner({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();
  const pageContext = usePageContext() as { urlPathname?: string };

  useEffect(() => {
    void ensureContentRevealReady();
  }, []);

  // Reveal [data-reveal] sections as they scroll into view rather than all
  // at once on page load, so content below the fold still animates in.
  // Re-runs on client-side navigation since Layout itself doesn't remount.
  // Waits for ensureContentRevealReady() so elements already hidden by CSS
  // when they're marked revealed — otherwise the animation's "both" fill
  // mode can snap already-visible content back to hidden for an instant.
  useEffect(() => {
    let cancelled = false;
    let observer: IntersectionObserver | null = null;

    void ensureContentRevealReady().then(() => {
      if (cancelled) return;

      const elements = Array.from(
        document.querySelectorAll<HTMLElement>("#page-content [data-reveal]")
      );
      if (elements.length === 0) return;

      if (typeof IntersectionObserver === "undefined") {
        elements.forEach((element) => element.classList.add("is-revealed"));
        return;
      }

      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            entry.target.classList.add("is-revealed");
            observer?.unobserve(entry.target);
          }
        },
        { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
      );

      elements.forEach((element) => observer?.observe(element));
    });

    return () => {
      cancelled = true;
      observer?.disconnect();
    };
  }, [pageContext.urlPathname]);

  return (
    <div className="notranslate flex min-h-screen flex-col" translate="no">
      <a href="#page-content" className="skip-link">
        {t("a11y.skipToContent")}
      </a>
      <PageLoading />
      <Navbar />
      <main id="page-content" className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <LayoutInner>{children}</LayoutInner>
    </I18nProvider>
  );
}
