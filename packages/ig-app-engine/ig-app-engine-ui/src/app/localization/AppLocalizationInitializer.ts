
import i18next, { type Resource } from 'i18next';
import { initReactI18next } from 'react-i18next';
import { usePlatformUiLocalization } from '../../../../../ig-lib/ig-client-lib/ig-platform-ui';

// must be called from root _layout, before anything is rendered
export const initI18n = (resources: Resource) => {
  const { languageCode } = usePlatformUiLocalization();
  const fallbackLng = 'en';

  i18next
    .use(initReactI18next)
    .use({
      type: 'postProcessor',
      name: 'lowercase',
      process: (value: string) => value.toLowerCase(),
    })
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
