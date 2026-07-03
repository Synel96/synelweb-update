import { useTranslation } from "react-i18next";
import { usePageContext } from "vike-react/usePageContext";
import { PageUnderDevelopment } from "@/components/PageUnderDevelopment";
import { DEFAULT_LANG, type SupportedLang } from "@/src/i18n-config";

export default function Page() {
  const pageContext = usePageContext() as { lang?: SupportedLang };
  const lang = pageContext.lang ?? DEFAULT_LANG;
  const contactHref = `/${lang}/contact`;
  const { t } = useTranslation();

  return <PageUnderDevelopment sectionLabel={t("homeFlow.projects.label")} contactHref={contactHref} />;
}
