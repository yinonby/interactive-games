
import { useAppLocalization, useGenericStyles } from '@ig/app-engine-ui';
import type { PublicGameConfigT } from '@ig/games-engine-models';
import { RnuiTable, RnuiTableCell, RnuiTableRow, RnuiText } from '@ig/rnui';
import { MS_TO_MIN } from '@ig/utils';
import React, { type FC } from 'react';
import { View } from 'react-native';
import type { TestableComponentT } from '../../../types/ComponentTypes';
import { MinimalPublicGameConfigTableRows } from './MinimalPublicGameConfigTableRows';

export type GameInfoSummaryViewPropsT = TestableComponentT & {
  gameInfo: PublicGameConfigT,
};

export const PublicGameConfigSummaryView: FC<GameInfoSummaryViewPropsT> = ({ gameInfo }) => {
  const { t } = useAppLocalization();
  const genericStyles = useGenericStyles();
  const extraTimeLimitMinutesStr = gameInfo.extraTimeLimitDurationInfo.kind === 'unlimited' ?
    t("common:unlimited") :
    t("common:minutes", { minutes: MS_TO_MIN(gameInfo.extraTimeLimitDurationInfo.durationMs) });

  return (
    <View style={genericStyles.spacing}>
      <RnuiText variant="titleSmall" >
        {gameInfo.gameName}
      </RnuiText>

      <RnuiTable>
        <MinimalPublicGameConfigTableRows testID='MinimalPublicGameConfigTableRows-tid' minimalPublicGameConfig={gameInfo} />

        <RnuiTableRow noHorizontalPadding dense>
          <RnuiTableCell>
            <RnuiText >
              {t("games:extraTimeLimit")}
            </RnuiText>
          </RnuiTableCell>
          <RnuiTableCell>
            <RnuiText >
              {extraTimeLimitMinutesStr}
            </RnuiText>
          </RnuiTableCell>
        </RnuiTableRow>
      </RnuiTable>
    </View>
  );
};
