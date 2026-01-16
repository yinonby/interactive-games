
import { currencyToSymbol, type PriceT } from "@ig/engine-models";
import { RnuiText } from "@ig/rnui";
import React, { type FC } from 'react';

export type PriceViewPropsT = {
  price: PriceT | undefined,
  testID?: string,
};

export const PriceView: FC<PriceViewPropsT> = ({ price }) => {
  if (price === undefined || price.priceRate === 0) {
    return (
      <RnuiText>Free</RnuiText>
    );
  } else {
    const symbol = currencyToSymbol[price.priceCurrency];
    return (
      <RnuiText>
        {symbol}{price.priceRate} {price.priceCurrency}
      </RnuiText>
    );
  }
};
