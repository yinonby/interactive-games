
import { useGenericStyles } from "@ig/engine-app-ui";
import type { GameConfigT } from "@ig/engine-models";
import React, { type FC } from 'react';
import { View } from 'react-native';
import type { TestableComponentT } from '../../../types/ComponentTypes';
import { GameImageCard } from '../../common/game-config/GameImageCard';
import { GameConfigSummaryView } from '../../games-summary/components/GameConfigSummaryView';
import { CreateGameInstanceButton } from './CreateGameInstanceButton';

export type GameConfigCardViewPropsT = TestableComponentT & {
  gameConfig: GameConfigT,
};

export const GameConfigCardView: FC<GameConfigCardViewPropsT> = ({ gameConfig }) => {
  const genericStyles = useGenericStyles();

  return (
    <GameImageCard testID='GameImageCard-tid' minimalGameConfig={gameConfig} includeFreeLabel={false}>
      <View style={genericStyles.verticalSpacing}>
        <GameConfigSummaryView testID='GameConfigSummaryView-tid' gameConfig={gameConfig} />

        <View style={{ flexDirection: "row" }}>
          <CreateGameInstanceButton testID='CreateGameInstanceButton-tid' gameConfigId={gameConfig.gameConfigId} />
        </View>
      </View>
    </GameImageCard>
  );
};
