
import { useGenericStyles } from '@ig/app-engine-ui';
import type { GameInfoT } from '@ig/games-engine-models';
import React, { type FC } from 'react';
import { View } from 'react-native';
import type { TestableComponentT } from '../../../types/ComponentTypes';
import { GameImageCard } from '../../common/game-info/GameImageCard';
import { GameInfoSummaryView } from '../../games-summary/components/GameInfoSummaryView';
import { CreateGameInstanceButton } from './CreateGameInstanceButton';

export type GameInfoCardViewPropsT = TestableComponentT & {
  gameInfo: GameInfoT,
};

export const GameInfoCardView: FC<GameInfoCardViewPropsT> = ({ gameInfo }) => {
  const genericStyles = useGenericStyles();

  return (
    <GameImageCard testID='GameImageCard-tid' minimalGameInfo={gameInfo} includeFreeLabel={false}>
      <View style={genericStyles.spacing}>
        <GameInfoSummaryView testID='GameInfoSummaryView-tid' gameInfo={gameInfo} />

        <View style={{ flexDirection: "row" }}>
          <CreateGameInstanceButton testID='CreateGameInstanceButton-tid' gameConfigId={gameInfo.gameConfigId} />
        </View>
      </View>
    </GameImageCard>
  );
};
