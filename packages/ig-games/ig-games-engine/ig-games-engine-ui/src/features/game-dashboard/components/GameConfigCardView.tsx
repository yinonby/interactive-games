
import { useGenericStyles } from '@ig/app-engine-ui';
import type { PublicGameConfigT } from '@ig/games-engine-models';
import React, { type FC } from 'react';
import { View } from 'react-native';
import type { TestableComponentT } from '../../../types/ComponentTypes';
import { GameImageCard } from '../../common/game-info/GameImageCard';
import { PublicGameConfigSummaryView } from '../../games-summary/components/PublicGameConfigSummaryView';
import { CreateGameInstanceButton } from './CreateGameInstanceButton';

export type GameConfigCardViewPropsT = TestableComponentT & {
  publicGameConfig: PublicGameConfigT,
};

export const GameConfigCardView: FC<GameConfigCardViewPropsT> = ({ publicGameConfig }) => {
  const genericStyles = useGenericStyles();

  return (
    <GameImageCard testID='GameImageCard-tid' minimalPublicGameConfig={publicGameConfig} includeFreeLabel={false}>
      <View style={genericStyles.spacing}>
        <PublicGameConfigSummaryView testID='PublicGameConfigSummaryView-tid' publicGameConfig={publicGameConfig} />

        <View style={{ flexDirection: "row" }}>
          <CreateGameInstanceButton testID='CreateGameInstanceButton-tid' gameConfigId={publicGameConfig.gameConfigId} />
        </View>
      </View>
    </GameImageCard>
  );
};
