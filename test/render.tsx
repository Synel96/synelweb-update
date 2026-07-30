import type { ReactElement } from "react";
import { render } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";
import { getTestI18n } from "./i18n-test-instance";
import type { SupportedLang } from "../src/i18n-config";

export async function renderWithI18n(ui: ReactElement, lang: SupportedLang = "hu") {
  const i18n = await getTestI18n(lang);
  return render(<I18nextProvider i18n={i18n}>{ui}</I18nextProvider>);
}
