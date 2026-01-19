
import { useAppLocalization, useGenericStyles } from "@ig/engine-app-ui";
import type { GameInstanceExposedInfoT } from "@ig/engine-models";
import { RnuiText } from "@ig/rnui";
import React, { type FC } from 'react';
import { View } from 'react-native';
import { GameStatusView } from "./GameStatusView";

export type GameInstanceSummaryViewPropsT = {
  gameInstanceExposedInfo: GameInstanceExposedInfoT,
  testID?: string,
};

export const GameInstanceSummaryView: FC<GameInstanceSummaryViewPropsT> = ({ gameInstanceExposedInfo }) => {
  const gameConfig = gameInstanceExposedInfo.gameConfig;
  const { t } = useAppLocalization();
  const genericStyles = useGenericStyles();

  return (
    <View>
      <View style={[genericStyles.spacingBottom, genericStyles.flexRowAlignTop]} >
        <View style={[genericStyles.flex1, genericStyles.spacingEnd]}>
          <RnuiText testID="title-tid" variant="titleSmall" >
            {gameConfig.gameName}
          </RnuiText>
        </View>

        <View >
          <GameStatusView testID="game-status-tid" gameStatus={gameInstanceExposedInfo.gameStatus} />
        </View>
      </View>

      <View style={genericStyles.spacingBottom} >
        <RnuiText testID="duration-text-tid">
          {t("common:duration") + ": " + t("common:minutes", { minutes: gameConfig.maxDurationMinutes })}
        </RnuiText>
      </View>

      <View style={genericStyles.spacingBottom} >
        <RnuiText testID="max-participants-tid">
          {t("games:maxParticipants") + ": " +  gameConfig.maxParticipants}
        </RnuiText>
      </View>
    </View>
  );
};
