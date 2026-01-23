
import { useAppErrorHandling } from "@ig/engine-app-ui";
import type { GameInstanceIdT } from "@ig/engine-models";
import { RnuiActivityIndicator } from "@ig/rnui";
import React, { useEffect, type FC } from 'react';
import { useGameInstanceModel } from "../../../../domains/game-instance/model/rtk/GameInstanceModel";
import type { TestableComponentT } from "../../../../types/ComponentTypes";
import { GameInstanceView } from "./GameInstanceView";

export type GameInstanceContainerPropsT = TestableComponentT & {
  gameInstanceId: GameInstanceIdT,
};

export const GameInstanceContainer: FC<GameInstanceContainerPropsT> = ({ gameInstanceId }) => {
  const { isLoading, isError, appErrCode, data: gameInstanceModelData } = useGameInstanceModel(gameInstanceId);
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

  return (
    <GameInstanceView
      testID="GameInstanceView-tid"
      gameInstanceExposedInfo={gameInstanceModelData.gameInstanceExposedInfo}
      gameInstanceChatMessages={gameInstanceModelData.gameInstanceChatMessages}
    />
  );
};
