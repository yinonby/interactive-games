
import type { UserIdT } from '@ig/app-engine-models';
import { AppError, extractAppErrorCodeFromUnknownObject } from '@ig/app-engine-ui';
import type { GameInstanceIdT } from '@ig/games-engine-models';
import { usePostGameInstanceChatMessageMutation, useStartGameMutation } from '../../model/rtk/GameInstanceRtkApi';

export type GameInstanceControllerT = {
  onStartGame: (gameInstanceId: GameInstanceIdT) => Promise<void>,
  onSendChatMessage: (gameInstanceId: GameInstanceIdT, playerUserId: UserIdT, chatMessage: string) => Promise<void>,
}

export function useGameInstanceController(): GameInstanceControllerT {
  const [
    postGameInstanceChatMessage,
  ] = usePostGameInstanceChatMessageMutation();
  const [
    startGame,
  ] = useStartGameMutation();

  const handleStartGame = async (gameInstanceId: GameInstanceIdT): Promise<void> => {
    const { error } = await startGame(gameInstanceId);
    if (error !== undefined) {
      throw new AppError(extractAppErrorCodeFromUnknownObject(error));
    }
  }

  const sendChatMessge = async (
    gameInstanceId: GameInstanceIdT,
    playerUserId: UserIdT,
    chatMessage: string
  ): Promise<void> => {
    const { error } = await postGameInstanceChatMessage({
      gameInstanceId: gameInstanceId,
      playerUserId: playerUserId,
      chatMessage: chatMessage,
    });
    if (error !== undefined) {
      throw new AppError(extractAppErrorCodeFromUnknownObject(error));
    }
  };

  return {
    onStartGame: handleStartGame,
    onSendChatMessage: sendChatMessge,
  }
}
