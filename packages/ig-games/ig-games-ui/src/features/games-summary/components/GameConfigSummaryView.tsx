
import { useAppLocalization, useGenericStyles } from "@ig/engine-ui";
import type { GameConfigT } from '@ig/games-models';
import { RnuiTable, RnuiTableCell, RnuiTableRow, RnuiText } from "@ig/rnui";
import React, { type FC } from 'react';
import { View } from 'react-native';
import type { TestableComponentT } from '../../../types/ComponentTypes';
import { MinimalGameConfigTableRows } from './MinimalGameConfigTableRows';

export type GameConfigSummaryViewPropsT = TestableComponentT & {
  gameConfig: GameConfigT,
};

export const GameConfigSummaryView: FC<GameConfigSummaryViewPropsT> = ({ gameConfig }) => {
  const { t } = useAppLocalization();
  const genericStyles = useGenericStyles();
  const extraTimeLimitMinutesStr = gameConfig.extraTimeLimitMinutes === 'unlimited' ?
    t("common:unlimited") :
    t("common:minutes", { minutes: gameConfig.extraTimeLimitMinutes });

  return (
    <View style={genericStyles.verticalSpacing}>
      <RnuiText variant="titleSmall" >
        {gameConfig.gameName}
      </RnuiText>

      <RnuiTable>
        <MinimalGameConfigTableRows testID='MinimalGameConfigTableRows-tid' minimalGameConfig={gameConfig} />

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
