
import type { Locale } from 'expo-localization';
import * as ExpoLocalization from 'expo-localization';
import { usePlatformUiLocalization } from './PlatformUiLocalization';

// mocks

jest.mock('expo-localization', () => ({
  // Provide a mocked getLocales function that tests can control.
  getLocales: jest.fn(),
}));

// tests

describe('usePlatformUiLocalization', () => {
  const spyOnGetLocales = jest.spyOn(ExpoLocalization, "getLocales");

  beforeEach(() => {
    spyOnGetLocales.mockReset();
  });

  it('returns the first locale from getLocales', () => {
    const first: Locale = {
      languageTag: 'en-US',
      region: 'US',
      // other fields may exist; include representative ones
      currencyCode: 'USD',
      measurementSystem: 'metric',
    } as unknown as Locale;

    const second: Locale = {
      languageTag: 'fr-FR',
      region: 'FR',
      currencyCode: 'EUR',
      measurementSystem: 'metric',
    } as unknown as Locale;

    spyOnGetLocales.mockReturnValue([first, second]);

    const result = usePlatformUiLocalization();

    expect(spyOnGetLocales).toHaveBeenCalled();
    expect(result).toBe(first);
  });

  it('handles web-like locales where currencyCode and measurementSystem may be null', () => {
    const webLocale: Locale = {
      languageTag: 'en-GB',
      region: 'GB',
      currencyCode: null as unknown as string | null,
      measurementSystem: null as unknown as string | null,
    } as unknown as Locale;

    spyOnGetLocales.mockReturnValue([webLocale]);

    const result = usePlatformUiLocalization();

    expect(spyOnGetLocales).toHaveBeenCalled();
    expect(result).toBe(webLocale);
    expect(result.currencyCode).toBeNull();
    expect(result.measurementSystem).toBeNull();
  });
});
