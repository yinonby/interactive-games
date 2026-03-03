
import type { GameConfigIdT } from '@ig/games-engine-models';
import { RnuiAppContent } from '@ig/rnui';
import React, { type FC } from 'react';
import { GameDashboardView } from '../components/GameDashboardView';

export type GameDashboardViewPageContentPropsT = {
  gameConfigId: GameConfigIdT,
};

export const GameDashboardViewPageContent: FC<GameDashboardViewPageContentPropsT> = (props) => {
  const { gameConfigId } = props;

  return (
    <RnuiAppContent testID="RnuiAppContent-tid">
      <GameDashboardView testID="GameDashboardView-tid" gameConfigId={gameConfigId} />
    </RnuiAppContent>
  );
};
