
import { currencyToSymbol, type PriceT } from "@ig/engine-models";
import { RnuiText } from "@ig/rnui";
import React, { type FC } from 'react';
import { useAppLocalization } from "../../../app/localization/AppLocalizationProvider";

export type PriceViewPropsT = {
  price: PriceT | undefined,
  testID?: string,
};

export const PriceView: FC<PriceViewPropsT> = ({ price }) => {
  const { t } = useAppLocalization();

  if (price === undefined || price.priceRate === 0) {
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
