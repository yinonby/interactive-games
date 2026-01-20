
import { useAppLocalization } from "@ig/engine-app-ui";
import { currencyToSymbol, type PriceT } from "@ig/engine-models";
import { RnuiText } from "@ig/rnui";
import React, { type FC } from 'react';

export type PriceViewPropsT = {
  price: PriceT | "free",
  testID?: string,
};

export const PriceView: FC<PriceViewPropsT> = ({ price }) => {
  const { t } = useAppLocalization();

  if (price === "free" || price.priceRate === 0) {
    return (
      <RnuiText>{t("common:free")}</RnuiText>
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
