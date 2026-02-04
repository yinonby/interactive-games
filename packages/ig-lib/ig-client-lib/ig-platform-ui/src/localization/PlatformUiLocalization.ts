
import { getLocales, type Locale } from 'expo-localization';

export const usePlatformUiLocalization = (): Locale => {
  const locales = getLocales() as [Locale, ...Locale[]]; // Guaranteed to contain at least 1 element.

  // On the web currency and measurements systems are not provided, instead returned as null.

  return locales[0];
}
