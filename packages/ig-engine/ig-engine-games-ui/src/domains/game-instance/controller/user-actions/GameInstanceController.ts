
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
    await postGameInstanceChatMessage({
      gameInstanceId: gameInstanceId,
      playerUserId: playerUserId,
      chatMessage: chatMessage,
    });
  };

  return {
    onSendChatMessage: sendChatMessge,
  }
}
