
import { useAppLocalization, useGenericStyles } from '@ig/app-engine-ui';
import type { GameInfoT } from '@ig/games-engine-models';
import { RnuiTable, RnuiTableCell, RnuiTableRow, RnuiText } from '@ig/rnui';
import { MS_TO_MIN } from '@ig/utils';
import React, { type FC } from 'react';
import { View } from 'react-native';
import type { TestableComponentT } from '../../../types/ComponentTypes';
import { MinimalGameInfoTableRows } from './MinimalGameInfoTableRows';

export type GameInfoSummaryViewPropsT = TestableComponentT & {
  gameInfo: GameInfoT,
};

export const GameInfoSummaryView: FC<GameInfoSummaryViewPropsT> = ({ gameInfo }) => {
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
        <MinimalGameInfoTableRows testID='MinimalGameInfoTableRows-tid' minimalGameInfo={gameInfo} />

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
