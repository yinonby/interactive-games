
import { usePlatformUiLocalization } from "@ig/platform-ui";
import i18next, { type Resource } from 'i18next';
import { initReactI18next } from "react-i18next";

// must be called from root _layout, before anything is rendered
export const initI18n = (resources: Resource) => {
  const { languageCode } = usePlatformUiLocalization();
  const fallbackLng = 'en';

  i18next
    .use(initReactI18next)
    .init({
      resources,
      lng: languageCode || "en",
      fallbackLng,
      compatibilityJSON: 'v4',
      interpolation: {
        escapeValue: false
      }
    });
}
