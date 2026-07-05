import { useEffect } from "react";
import { Footer } from "../components/Footer";
import { I18nProvider } from "../components/I18nProvider";
import { Navbar } from "../components/Navbar";
import { PageLoading } from "../components/PageLoading";
import { useTranslation } from "react-i18next";

function LayoutInner({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();

  useEffect(() => {
    // Defer non-critical animation CSS so it doesn't block first paint.
    void import("./Layout.noncritical.css");
  }, []);

  useEffect(() => {
    document.body.classList.add("content-animate");
    document.body.classList.remove("content-ready");

    const frameId = requestAnimationFrame(() => {
      document.body.classList.add("content-ready");
    });

    return () => cancelAnimationFrame(frameId);
  }, []);

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
