
import { render } from '@testing-library/react-native';
import React from 'react';
import { buildMockedTranslation } from "../../../../test/mocks/EngineAppUiMocks";
import { PriceView } from './PriceView';

// Mock engine models currency symbols and RnuiText rendering
jest.mock('@ig/engine-models', () => ({
  currencyToSymbol: { USD: '$', EUR: '€' },
}));

describe('PriceView', () => {
  test('renders Free when price is undefined', () => {
    const { getByText } = render(<PriceView priceInfo={{ kind: "free"}} />);

    getByText(buildMockedTranslation("common:free"));
  });

  test('renders Free when priceRate is 0', () => {
    const { getByText } = render(<PriceView priceInfo={{ kind: 'notFree', priceRate: 0, priceCurrency: 'USD' }} />);

    getByText(buildMockedTranslation("common:free"));
  });

  test('renders symbol, rate and currency when price is provided', () => {
    const { getByText } = render(<PriceView priceInfo={{ kind: 'notFree', priceRate: 5, priceCurrency: 'USD' }} />);

    getByText('$5 USD');
  });

  test('renders other currencies using currencyToSymbol', () => {
    const { getByText } = render(<PriceView priceInfo={{ kind: 'notFree', priceRate: 10, priceCurrency: 'EUR' }} />);

    getByText('€10 EUR');
  });
});
