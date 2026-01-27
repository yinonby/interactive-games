
import { useAppLocalization } from "@ig/engine-ui";
import type { MinimalGameConfigT } from '@ig/games-models';
import { MS_TO_MIN } from '@ig/lib';
import { RnuiTableCell, RnuiTableRow, RnuiText } from "@ig/rnui";
import React, { type FC } from 'react';
import type { TestableComponentT } from '../../../types/ComponentTypes';
import { PriceView } from "./PriceView";

export type MinimalGameConfigSummaryViewPropsT = TestableComponentT & {
  minimalGameConfig: MinimalGameConfigT,
};

export const MinimalGameConfigTableRows: FC<MinimalGameConfigSummaryViewPropsT> = ({ minimalGameConfig }) => {
  const { t } = useAppLocalization();
  const durationMinutesStr = minimalGameConfig.maxDurationInfo.kind === 'unlimited' ?
    t("common:unlimited") :
    t("common:minutes", { minutes: MS_TO_MIN(minimalGameConfig.maxDurationInfo.durationMs) });

  return (
    <>
      <RnuiTableRow noHorizontalPadding dense>
        <RnuiTableCell>
          <RnuiText >
            {t("common:duration")}
          </RnuiText>
        </RnuiTableCell>
        <RnuiTableCell>
          <RnuiText >
            {durationMinutesStr}
          </RnuiText>
        </RnuiTableCell>
      </RnuiTableRow>

      <RnuiTableRow noHorizontalPadding dense>
        <RnuiTableCell>
          <RnuiText >
            {t("games:maxParticipants")}
          </RnuiText>
        </RnuiTableCell>
        <RnuiTableCell>
          <RnuiText >
            {minimalGameConfig.maxParticipants}
          </RnuiText>
        </RnuiTableCell>
      </RnuiTableRow>

      <RnuiTableRow noHorizontalPadding dense>
        <RnuiTableCell>
          <RnuiText >
            {t("common:price")}
          </RnuiText>
        </RnuiTableCell>
        <RnuiTableCell>
          <PriceView testID="price-view-tid" priceInfo={minimalGameConfig.gamePriceInfo} />
        </RnuiTableCell>
      </RnuiTableRow>
    </>
  );
};
