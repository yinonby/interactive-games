
import { AppError, extractAppErrorCodeFromUnknownObject } from '@ig/engine-app-ui';
import type { GameConfigIdT, GameInstanceIdT } from "@ig/engine-models";
import {
  useCreateGameInstanceMutation,
  useGamesAcceptInviteMutation,
  useGamesPlayGameMutation
} from "../../model/rtk/GamesUserConfigRtkApi";

export type GamesUserConfigControllerT = {
  onPlayGame: (gameConfigId: GameConfigIdT) => Promise<void>,
  onAcceptInvite: (invitationCode: string) => Promise<GameInstanceIdT>,
  onCreateGameInstance: (gameConfigId: GameConfigIdT) => Promise<GameInstanceIdT>,
}

export function useGamesUserConfigController(): GamesUserConfigControllerT {
  const [
    playGame,
  ] = useGamesPlayGameMutation();
  const [
    acceptInvite,
  ] = useGamesAcceptInviteMutation();
  const [
    createGameInstance,
  ] = useCreateGameInstanceMutation();

  const handlePlayGame = async (gameConfigId: GameConfigIdT): Promise<void> => {
    const { error } = await playGame(gameConfigId);
    if (error !== undefined) {
      throw new AppError(extractAppErrorCodeFromUnknownObject(error));
    }
  };

  const handleAcceptInvite = async (invitationCode: string): Promise<GameInstanceIdT> => {
    await Promise.resolve();
    const { error, data: postAcceptInviteResponse } = await acceptInvite(invitationCode);
    if (error !== undefined) {
      throw new AppError(extractAppErrorCodeFromUnknownObject(error));
    }

    return postAcceptInviteResponse.gameInstanceId;
  };

  const handleCreateGameInstance = async (gameConfigId: GameConfigIdT): Promise<GameInstanceIdT> => {
    await Promise.resolve();
    const { error, data: postAcceptInviteResponse } = await createGameInstance(gameConfigId);
    if (error !== undefined) {
      throw new AppError(extractAppErrorCodeFromUnknownObject(error));
    }

    return postAcceptInviteResponse.gameInstanceId;
  };

  return {
    onPlayGame: handlePlayGame,
    onAcceptInvite: handleAcceptInvite,
    onCreateGameInstance: handleCreateGameInstance,
  }
}
