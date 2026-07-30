import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";

const { usePageContext } = vi.hoisted(() => ({ usePageContext: vi.fn() }));
vi.mock("vike-react/usePageContext", () => ({ usePageContext }));

const { mockI18n, ensureLanguageResources, cloneInstance } = vi.hoisted(() => {
  const changeLanguage = vi.fn().mockResolvedValue(undefined);
  const instance = { language: "hu", changeLanguage };
  return {
    ensureLanguageResources: vi.fn().mockResolvedValue(undefined),
    cloneInstance: vi.fn().mockReturnValue(instance),
    mockI18n: instance,
  };
});

vi.mock("react-i18next", () => ({
  I18nextProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock("@/src/i18n", () => ({
  default: { ...mockI18n, cloneInstance },
  ensureLanguageResources,
}));

import { I18nProvider } from "./I18nProvider";

afterEach(() => {
  document.documentElement.lang = "";
  mockI18n.language = "hu";
});

describe("I18nProvider (client)", () => {
  it("syncs i18next and <html lang> to the resolved page language", async () => {
    usePageContext.mockReturnValue({ lang: "de" });

    render(
      <I18nProvider>
        <div>child</div>
      </I18nProvider>
    );

    await waitFor(() => expect(ensureLanguageResources).toHaveBeenCalledWith("de"));
    await waitFor(() => expect(mockI18n.changeLanguage).toHaveBeenCalledWith("de"));
    await waitFor(() => expect(document.documentElement.lang).toBe("de"));
  });

  it("does not call changeLanguage when i18n is already on the target language", async () => {
    mockI18n.language = "hu";
    usePageContext.mockReturnValue({ lang: "hu" });

    render(
      <I18nProvider>
        <div>child</div>
      </I18nProvider>
    );

    await waitFor(() => expect(ensureLanguageResources).toHaveBeenCalledWith("hu"));
    expect(mockI18n.changeLanguage).not.toHaveBeenCalled();
  });

  it("falls back to the default language when pageContext.lang is unset", async () => {
    usePageContext.mockReturnValue({});

    render(
      <I18nProvider>
        <div>child</div>
      </I18nProvider>
    );

    await waitFor(() => expect(ensureLanguageResources).toHaveBeenCalledWith("hu"));
  });

  it("renders children", () => {
    usePageContext.mockReturnValue({ lang: "en" });
    render(
      <I18nProvider>
        <div>child content</div>
      </I18nProvider>
    );
    expect(screen.getByText("child content")).toBeInTheDocument();
  });

  it("never clones the instance on the client", () => {
    usePageContext.mockReturnValue({ lang: "en" });
    render(
      <I18nProvider>
        <div>child</div>
      </I18nProvider>
    );
    expect(cloneInstance).not.toHaveBeenCalled();
  });
});
