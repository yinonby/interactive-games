
import type { GameInstanceIdT } from '@ig/games-models';
import { RnuiAppContent } from "@ig/rnui";
import React, { type FC } from 'react';
import { GameInstanceContainer } from "../dashboard/components/GameInstanceContainer";

export type GameInstancePageContentPropsT = {
  gameInstanceId: GameInstanceIdT,
};

export const GameInstancePageContent: FC<GameInstancePageContentPropsT> = (props) => {
  return (
    <RnuiAppContent testID="app-content-tid">
      <GameInstanceContainer testID="game-instance-container-tid" {...props} />
    </RnuiAppContent>
  );
};
