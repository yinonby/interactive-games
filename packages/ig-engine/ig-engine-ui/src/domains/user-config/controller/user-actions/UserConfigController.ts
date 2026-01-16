
import type { GameConfigIdT, GameInstanceIdT } from "@ig/engine-models";
import { useAcceptInviteMutation, useAddGameConfigMutation, usePlayGameMutation } from "../../model/rtk/UserConfigRtkApi";

export type UserConfigControllerT = {
  onAddGame: (gameCode: string) => Promise<void>,
  onPlayGame: (gameConfigId: GameConfigIdT) => Promise<GameInstanceIdT | null>,
  onAcceptInvite: (invitationCode: string) => Promise<GameInstanceIdT | null>,
}

export function useUserConfigController(): UserConfigControllerT {
  const [
    addGameConfig,
  ] = useAddGameConfigMutation();
  const [
    playGame,
  ] = usePlayGameMutation();
  const [
    acceptInvite,
  ] = useAcceptInviteMutation();

  const handleAddGame = async (gameCode: string): Promise<void> => {
    await addGameConfig(gameCode);
  };

  const handlePlayGame = async (gameConfigId: GameConfigIdT): Promise<GameInstanceIdT | null> => {
    const { data: postPlayGameResponse } = await playGame(gameConfigId);

    if (postPlayGameResponse === undefined) {
      return null;
    }

    return postPlayGameResponse.gameInstanceId;
  };

  const handleAcceptInvite = async (invitationCode: string): Promise<GameInstanceIdT | null> => {
    const { data: postAcceptInviteResponse } = await acceptInvite(invitationCode);

    if (postAcceptInviteResponse === undefined) {
      return null;
    }

    return postAcceptInviteResponse.gameInstanceId;
  };

  return {
    onAddGame: handleAddGame,
    onPlayGame: handlePlayGame,
    onAcceptInvite: handleAcceptInvite,
  }
}
