
import { useAppLocalization } from "@ig/engine-ui";
import { currencyToSymbol, PriceInfoT } from '@ig/games-models';
import { RnuiText } from "@ig/rnui";
import React, { type FC } from 'react';

export type PriceViewPropsT = {
  priceInfo: PriceInfoT,
  testID?: string,
};

export const PriceView: FC<PriceViewPropsT> = ({ priceInfo }) => {
  const { t } = useAppLocalization();

  if (priceInfo.kind === "free" || priceInfo.priceRate === 0) {
    return (
      <RnuiText>{t("common:free")}</RnuiText>
    );
  } else {
    const symbol = currencyToSymbol[priceInfo.priceCurrency];
    return (
      <RnuiText>
        {symbol}{priceInfo.priceRate} {priceInfo.priceCurrency}
      </RnuiText>
    );
  }
};
