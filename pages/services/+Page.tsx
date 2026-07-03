import { usePageContext } from "vike-react/usePageContext";
import { useTranslation } from "react-i18next";
import { PageUnderDevelopment } from "@/components/PageUnderDevelopment";
import { DEFAULT_LANG, type SupportedLang } from "@/src/i18n-config";

export default function Page() {
  const pageContext = usePageContext() as { lang?: SupportedLang };
  const lang = pageContext.lang ?? DEFAULT_LANG;
  const { t } = useTranslation();
  const contactHref = `/${lang}/contact`;

  return <PageUnderDevelopment sectionLabel={t("homeFlow.services.label")} contactHref={contactHref} />;
}
