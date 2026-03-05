
import type { AuthTranslationKeyT } from '@ig/auth-ui-models';
import { jest } from '@jest/globals';
import { render } from '@testing-library/react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text } from 'react-native';
import { useAuthLocalization } from './AuthLocalization';

describe('AuthLocalization', () => {
  const mock_useTranslation = useTranslation as jest.MockedFunction<typeof useTranslation>;
  const mock_t = jest.fn((key: string) => `translated:${key}`);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mock_useTranslation.mockReturnValue({ t: mock_t } as any);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('calls useTranslation and provides t that proxies to react-i18next t', () => {

    const TestConsumer: React.FC = () => {
      const { t } = useAuthLocalization();
      return <Text testID="Text-tid">{t('testKey' as AuthTranslationKeyT)}</Text>;
    };

    const { getByTestId } = render(
      <TestConsumer />
    );

    expect(mock_useTranslation).toHaveBeenCalled();
    expect(mock_t).toHaveBeenCalledWith('testKey', undefined);
    expect(getByTestId('Text-tid').props.children).toBe('translated:testKey');
  });
});
