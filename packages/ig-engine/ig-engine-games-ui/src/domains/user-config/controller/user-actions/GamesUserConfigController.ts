
import { AppError, extractAppErrorCodeFromUnknownObject } from '@ig/engine-app-ui';
import type { GameConfigIdT, GameInstanceIdT } from "@ig/engine-models";
import {
  useGamesAcceptInviteMutation,
  useGamesPlayGameMutation
} from "../../model/rtk/GamesUserConfigRtkApi";

export type GamesUserConfigControllerT = {
  onPlayGame: (gameConfigId: GameConfigIdT) => Promise<GameInstanceIdT | null>,
  onAcceptInvite: (invitationCode: string) => Promise<GameInstanceIdT>,
}

export function useGamesUserConfigController(): GamesUserConfigControllerT {
  const [
    playGame,
  ] = useGamesPlayGameMutation();
  const [
    acceptInvite,
  ] = useGamesAcceptInviteMutation();

  const handlePlayGame = async (gameConfigId: GameConfigIdT): Promise<GameInstanceIdT | null> => {
    const { error, data: postPlayGameResponse } = await playGame(gameConfigId);
    if (error !== undefined) {
      throw new AppError(extractAppErrorCodeFromUnknownObject(error));
    }

    return postPlayGameResponse.gameInstanceId;
  };

  const handleAcceptInvite = async (invitationCode: string): Promise<GameInstanceIdT> => {
    await Promise.resolve();
    const { error, data: postAcceptInviteResponse } = await acceptInvite(invitationCode);
    if (error !== undefined) {
      throw new AppError(extractAppErrorCodeFromUnknownObject(error));
    }

    return postAcceptInviteResponse.gameInstanceId;
  };

  return {
    onPlayGame: handlePlayGame,
    onAcceptInvite: handleAcceptInvite,
  }
}
