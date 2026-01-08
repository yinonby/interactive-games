
import type { GameInstanceIdT } from "@ig/engine-models";
import { RnuiText } from "@ig/rnui";
import React, { type FC } from 'react';
import { useGameInstanceModel } from "../../../domains/game-instance/model/rtk/GameInstanceModel";
import type { TestableComponentT } from "../../../types/ComponentTypes";
import { GameInstanceView } from "./GameInstanceView";

export type GameInstanceContainerPropsT = TestableComponentT & {
  gameInstanceId: GameInstanceIdT,
};

export const GameInstanceContainer: FC<GameInstanceContainerPropsT> = ({ gameInstanceId }) => {
  const { isLoading, isError, data: gameInstanceModel } = useGameInstanceModel(gameInstanceId);

  if (isLoading) return <RnuiText>Loading</RnuiText>;
  if (isError) return <RnuiText>Error</RnuiText>;

  return (
    <GameInstanceView
      testID="game-instance-view-tid"
      gameInstanceExposedInfo={gameInstanceModel.gameInstanceExposedInfo}
      gameInstanceChatMessages={gameInstanceModel.gameInstanceChatMessages}
    />
  );
};
