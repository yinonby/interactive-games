
import { useGenericStyles } from '@ig/app-engine-ui';
import type { PublicGameConfigT } from '@ig/games-engine-models';
import React, { type FC } from 'react';
import { View } from 'react-native';
import type { TestableComponentT } from '../../../types/ComponentTypes';
import { GameImageCard } from '../../common/game-info/GameImageCard';
import { PublicGameConfigSummaryView } from '../../games-summary/components/PublicGameConfigSummaryView';
import { CreateGameInstanceButton } from './CreateGameInstanceButton';

export type GameInfoCardViewPropsT = TestableComponentT & {
  gameInfo: PublicGameConfigT,
};

export const GameConfigCardView: FC<GameInfoCardViewPropsT> = ({ gameInfo }) => {
  const genericStyles = useGenericStyles();

  return (
    <GameImageCard testID='GameImageCard-tid' minimalPublicGameConfig={gameInfo} includeFreeLabel={false}>
      <View style={genericStyles.spacing}>
        <PublicGameConfigSummaryView testID='PublicGameConfigSummaryView-tid' gameInfo={gameInfo} />

        <View style={{ flexDirection: "row" }}>
          <CreateGameInstanceButton testID='CreateGameInstanceButton-tid' gameConfigId={gameInfo.gameConfigId} />
        </View>
      </View>
    </GameImageCard>
  );
};
