
import type { PriceT } from "@ig/engine-models";
import { render } from '@testing-library/react-native';
import React from 'react';
import { PriceView } from './PriceView';

// Mock engine models currency symbols and RnuiText rendering
jest.mock('@ig/engine-models', () => ({
  currencyToSymbol: { USD: '$', EUR: '€' },
}));

describe('PriceView', () => {
  test('renders Free when price is undefined', () => {
    const { getByText } = render(<PriceView price={undefined} />);
    expect(getByText('Free')).toBeDefined();
  });

  test('renders Free when priceRate is 0', () => {
    const { getByText } = render(<PriceView price={{ priceRate: 0, priceCurrency: 'USD' } as PriceT} />);
    expect(getByText('Free')).toBeDefined();
  });

  test('renders symbol, rate and currency when price is provided', () => {
    const { getByText } = render(<PriceView price={{ priceRate: 5, priceCurrency: 'USD' } as PriceT} />);
    expect(getByText('$5 USD')).toBeDefined();
  });

  test('renders other currencies using currencyToSymbol', () => {
    const { getByText } = render(<PriceView price={{ priceRate: 10, priceCurrency: 'EUR' } as PriceT} />);
    expect(getByText('€10 EUR')).toBeDefined();
  });
});
