import { useEffect } from "react";
import { Footer } from "../components/Footer";
import { I18nProvider } from "../components/I18nProvider";
import { Navbar } from "../components/Navbar";
import { PageLoading } from "../components/PageLoading";
import { useTranslation } from "react-i18next";
import { usePageContext } from "vike-react/usePageContext";

function LayoutInner({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();
  const pageContext = usePageContext() as { urlPathname?: string };

  useEffect(() => {
    let isActive = true;
    let firstFrameId = 0;
    let secondFrameId = 0;

    const triggerContentReveal = () => {
      document.body.classList.add("content-animate");
      document.body.classList.remove("content-ready");

      firstFrameId = requestAnimationFrame(() => {
        secondFrameId = requestAnimationFrame(() => {
          document.body.classList.add("content-ready");
        });
      });
    };

    // Defer non-critical animation CSS so it doesn't block first paint,
    // then trigger reveal once styles are available.
    void import("./Layout.noncritical.css").finally(() => {
      if (!isActive) return;
      triggerContentReveal();
    });

    return () => {
      isActive = false;
      cancelAnimationFrame(firstFrameId);
      cancelAnimationFrame(secondFrameId);
    };
  }, []);

  // Reveal [data-reveal] sections as they scroll into view rather than all
  // at once on page load, so content below the fold still animates in.
  // Re-runs on client-side navigation since Layout itself doesn't remount.
  useEffect(() => {
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>("#page-content [data-reveal]")
    );
    if (elements.length === 0) return;

    if (typeof IntersectionObserver === "undefined") {
      elements.forEach((element) => element.classList.add("is-revealed"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
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
