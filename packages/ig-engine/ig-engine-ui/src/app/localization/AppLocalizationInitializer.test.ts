
import { usePlatformUiLocalization } from "@ig/platform-ui";
import type { Resource } from "i18next";
import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import { initI18n } from "./AppLocalizationInitializer";

jest.mock("@ig/platform-ui", () => ({
  usePlatformUiLocalization: jest.fn(),
}));

jest.mock("i18next", () => ({
  use: jest.fn().mockReturnThis(),
  init: jest.fn(),
}));

jest.mock("react-i18next", () => ({
  initReactI18next: jest.fn(),
}));

describe("initI18n", () => {
  const useSpy = jest.spyOn(i18next, 'use');
  const initSpy = jest.spyOn(i18next, 'init');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calls i18next.use with initReactI18next and init with provided languageCode", () => {
    (usePlatformUiLocalization as unknown as jest.Mock).mockReturnValue({
      languageCode: "fr",
    });

    const resources = { fr: { translation: { key: "val" } } } as unknown as Resource;
    initI18n(resources);

    expect(useSpy).toHaveBeenCalledWith(initReactI18next);
    expect(initSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        resources,
        lng: "fr",
        fallbackLng: "en",
        compatibilityJSON: "v4",
        interpolation: { escapeValue: false },
      })
    );
  });

  it("falls back to 'en' when languageCode is not provided", () => {
    (usePlatformUiLocalization as unknown as jest.Mock).mockReturnValue({});

    const resources = { en: { translation: { key: "val" } } } as unknown as Resource;
    initI18n(resources);

    expect(useSpy).toHaveBeenCalledWith(initReactI18next);
    expect(initSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        resources,
        lng: "en",
        fallbackLng: "en",
      })
    );
  });
});