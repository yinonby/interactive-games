
import type { GameInstanceIdT } from '@ig/games-engine-models';
import React, { type FC } from 'react';
import { useGameInstanceModel } from '../../../../domains/game-instance/model/rtk/GameInstanceModel';
import { ModelLoadingView } from '../../../../features/common/ModelLoadingView';
import type { TestableComponentT } from '../../../../types/ComponentTypes';
import { GameInstanceView } from './GameInstanceView';

export type GameInstanceContainerPropsT = TestableComponentT & {
  gameInstanceId: GameInstanceIdT,
};

export const GameInstanceContainer: FC<GameInstanceContainerPropsT> = ({ gameInstanceId }) => {
  const { isLoading, isError, appErrCode, data: gameInstanceModelData } = useGameInstanceModel(gameInstanceId);

  if (isLoading || isError) {
    return (
      <ModelLoadingView
        testID='ModelLoadingView-tid'
        isLoading={isLoading}
        appErrCode={isError ? appErrCode : null}
      />
    );
  }

  return (
    <GameInstanceView
      testID="GameInstanceView-tid"
      publicGameInstance={gameInstanceModelData.publicGameInstance}
    />
  );
};
