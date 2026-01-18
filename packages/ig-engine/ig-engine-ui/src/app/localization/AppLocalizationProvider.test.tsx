
import { jest } from '@jest/globals';
import { render } from '@testing-library/react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text } from "react-native";
import type { AppTranslationKeyT } from "../../types/CommonTranslationTypes";
import { AppLocalizationProvider, useAppLocalization } from './AppLocalizationProvider';

jest.unmock("./AppLocalizationProvider");

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(),
}));

describe('AppLocalizationProvider', () => {
  const useTranslationMock = useTranslation as jest.MockedFunction<typeof useTranslation>;

  beforeEach(() => {
    useTranslationMock.mockReset();
  });

  test('calls useTranslation and provides t that proxies to react-i18next t', () => {
    const tMock = jest.fn((key: string) => `translated:${key}`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    useTranslationMock.mockReturnValue({ t: tMock } as any);

    const TestConsumer: React.FC = () => {
      const { t } = useAppLocalization();
      return <Text testID="out">{t('testKey' as AppTranslationKeyT)}</Text>;
    };

    const { getByTestId } = render(
      <AppLocalizationProvider>
        <TestConsumer />
      </AppLocalizationProvider>
    );

    expect(useTranslationMock).toHaveBeenCalled();
    expect(tMock).toHaveBeenCalledWith('testKey', undefined);
    expect(getByTestId('out').props.children).toBe('translated:testKey');
  });
});
