
import { useAppLocalization } from '@ig/app-engine-ui';
import type { MinimalPublicGameConfigT } from '@ig/games-engine-models';
import { RnuiTableCell, RnuiTableRow, RnuiText } from '@ig/rnui';
import { MS_TO_MIN } from '@ig/utils';
import React, { type FC } from 'react';
import type { TestableComponentT } from '../../../types/ComponentTypes';
import { PriceView } from './PriceView';

export type MinimalPublicGameConfigTableRowsPropsT = TestableComponentT & {
  minimalPublicGameConfig: MinimalPublicGameConfigT,
};

export const MinimalPublicGameConfigTableRows: FC<MinimalPublicGameConfigTableRowsPropsT> = ({ minimalPublicGameConfig }) => {
  const { t } = useAppLocalization();
  const durationMinutesStr = minimalPublicGameConfig.maxDurationInfo.kind === 'unlimited' ?
    t("common:unlimited") :
    t("common:minutes", { minutes: MS_TO_MIN(minimalPublicGameConfig.maxDurationInfo.durationMs) });

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
            {minimalPublicGameConfig.maxParticipants}
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
          <PriceView testID="price-view-tid" priceInfo={minimalPublicGameConfig.gamePriceInfo} />
        </RnuiTableCell>
      </RnuiTableRow>
    </>
  );
};
