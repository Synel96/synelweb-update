import "./Layout.css";
import { Footer } from "../components/Footer";
import { I18nProvider } from "../components/I18nProvider";
import { Navbar } from "../components/Navbar";
import { PageLoading } from "../components/PageLoading";
import { useTranslation } from "react-i18next";

function LayoutInner({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();
  return (
    <div className="flex min-h-screen flex-col">
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
