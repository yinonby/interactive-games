
import type { GameInstanceExposedInfoT } from "@ig/engine-models";
import { RnuiText } from "@ig/rnui";
import React, { type FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { GameStatusView } from "./GameStatusView";

export type GameInstanceSummaryViewPropsT = {
  gameInstanceExposedInfo: GameInstanceExposedInfoT,
  testID?: string,
};

export const GameInstanceSummaryView: FC<GameInstanceSummaryViewPropsT> = ({ gameInstanceExposedInfo }) => {
  const gameConfig = gameInstanceExposedInfo.gameConfig;

  return (
    <View>
      <View style={[styles.spacingBottom, styles.flexRow]} >
        <View style={styles.flex1}>
          <RnuiText testID="title-tid" variant="titleSmall" >
            {gameConfig.gameName}
          </RnuiText>
        </View>

        <View >
          <GameStatusView testID="game-status-tid" gameStatus={gameInstanceExposedInfo.gameStatus} />
        </View>
      </View>

      <View style={styles.spacingBottom} >
        <RnuiText testID="duration-text-tid">
          Duration: {gameConfig.maxDurationMinutes} min.
        </RnuiText>
      </View>

      <View style={styles.spacingBottom} >
        <RnuiText testID="max-participants-tid">
          Max participants: {gameConfig.maxParticipants}
        </RnuiText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  spacingBottom: {
    marginBottom: 8,
  },
  flexRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  flex1: {
    flex: 1,
  },
});
