
import { useAppErrorHandling } from '@ig/app-engine-ui';
import type { GameConfigIdT, GameConfigT } from '@ig/games-engine-models';
import { RnuiActivityIndicator, RnuiAppContent } from '@ig/rnui';
import React, { useEffect, type FC } from 'react';
import { useGamesUserConfigModel } from '../../../domains/user-config/model/rtk/GamesUserConfigModel';
import { GameDashboardView } from '../components/GameDashboardView';

export type GameDashboardViewPageContentPropsT = {
  gameConfigId: GameConfigIdT,
};

export const GameDashboardViewPageContent: FC<GameDashboardViewPageContentPropsT> = (props) => {
  const { gameConfigId } = props;
  const { isLoading, isError, appErrCode, data: gamesUserConfigModelData } = useGamesUserConfigModel();
  const { onAppError } = useAppErrorHandling();

  useEffect(() => {
    if (isError) {
      onAppError(appErrCode);
    }
  }, [isError, onAppError, appErrCode]);

  if (isLoading) return <RnuiActivityIndicator testID="RnuiActivityIndicator-tid" size="large"/>;
  if (isError) {
    return null;
  }

  const gameConfig: GameConfigT | undefined =
    gamesUserConfigModelData.gamesUserConfig.joinedGameConfigs.find(e => e.gameConfigId === gameConfigId);

  if (gameConfig === undefined) {
    return null;
  }

  return (
    <RnuiAppContent testID="RnuiAppContent-tid">
      <GameDashboardView testID="GameDashboardView-tid" joinedGameConfig={gameConfig} />
    </RnuiAppContent>
  );
};
