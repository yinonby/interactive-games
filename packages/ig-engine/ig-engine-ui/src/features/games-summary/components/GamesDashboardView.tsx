
import React, { type FC } from 'react';
import { View } from 'react-native';
import { AddGameView } from "./AddGameView";
import { AvailableGamesView } from "./AvailableGamesView";
import { GamesSummaryView } from "./GamesSummaryView";

export type GamesDashboardViewPropsT = {
  testID?: string,
};

export const GamesDashboardView: FC<GamesDashboardViewPropsT> = () => {
  return (
    <View >
      <View style={{ marginBottom: 8 }} >
        <GamesSummaryView />
      </View>

      <View style={{ marginBottom: 8 }} >
        <AddGameView />
      </View>

      <View style={{ marginBottom: 8 }} >
        <AvailableGamesView />
      </View>
    </View>
  );
};
