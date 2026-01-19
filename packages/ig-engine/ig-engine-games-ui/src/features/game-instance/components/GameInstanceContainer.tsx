
import { useAppErrorHandling } from "@ig/engine-app-ui";
import type { GameInstanceIdT } from "@ig/engine-models";
import { RnuiActivityIndicator } from "@ig/rnui";
import React, { useEffect, type FC } from 'react';
import { useGameInstanceModel } from "../../../domains/game-instance/model/rtk/GameInstanceModel";
import type { TestableComponentT } from "../../../types/ComponentTypes";
import { GameInstanceView } from "./GameInstanceView";

export type GameInstanceContainerPropsT = TestableComponentT & {
  gameInstanceId: GameInstanceIdT,
};

export const GameInstanceContainer: FC<GameInstanceContainerPropsT> = ({ gameInstanceId }) => {
  const { isLoading, isError, appErrCode, data: gameInstanceModel } = useGameInstanceModel(gameInstanceId);
  const { onError } = useAppErrorHandling();

  useEffect(() => {
    if (isError) {
      onError(appErrCode);
    }
  }, [isError, onError, appErrCode]);

  if (isLoading) return <RnuiActivityIndicator testID="activity-indicator-tid" size="large"/>;
  if (isError) {
    return null;
  }

  return (
    <GameInstanceView
      testID="game-instance-view-tid"
      gameInstanceExposedInfo={gameInstanceModel.gameInstanceExposedInfo}
      gameInstanceChatMessages={gameInstanceModel.gameInstanceChatMessages}
    />
  );
};
