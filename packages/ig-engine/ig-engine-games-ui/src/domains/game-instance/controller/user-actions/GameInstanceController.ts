
import { AppError, extractAppErrorCodeFromUnknownObject } from '@ig/engine-app-ui';
import type { GameInstanceIdT, UserIdT } from "@ig/engine-models";
import { usePostGameInstanceChatMessageMutation } from "../../model/rtk/GameInstanceRtkApi";

export type GameInstanceControllerT = {
  onSendChatMessage: (gameInstanceId: GameInstanceIdT, playerUserId: UserIdT, chatMessage: string) => Promise<void>,
}

export function useGameInstanceController(): GameInstanceControllerT {
  const [
    postGameInstanceChatMessage,
  ] = usePostGameInstanceChatMessageMutation();

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
    onSendChatMessage: sendChatMessge,
  }
}
