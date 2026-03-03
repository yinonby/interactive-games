
import { AppError, extractAppErrorCodeFromUnknownObject } from '@ig/app-engine-ui';
import type { GameConfigIdT, GameInstanceIdT } from '@ig/games-engine-models';
import {
  useCreateGameInstaceMutation,
  useJoinGameByInviteMutation,
  useStartPlayingMutation,
  useSubmitGuessMutation
} from '../../model/rtk/GameInstanceRtkApi';

export type GameInstanceControllerT = {
  onCreateGameInstance: (gameConfigId: GameConfigIdT) => Promise<GameInstanceIdT>,
  onJoinGameByInvite: (invitationCode: string) => Promise<GameInstanceIdT>,
  onStartPlaying: (gameInstanceId: GameInstanceIdT) => Promise<void>,
  onSubmitGuess: (gameInstanceId: GameInstanceIdT, levelIdx: number, guess: string) => Promise<boolean>,
}

export function useGameInstanceController(): GameInstanceControllerT {
  const [ createGameInstance ] = useCreateGameInstaceMutation();
  const [ joinGameByInvite ] = useJoinGameByInviteMutation();
  const [ startPlaying ] = useStartPlayingMutation();
  const [ submitGuess ] = useSubmitGuessMutation();

  async function handleCreateGameInstance(gameConfigId: GameConfigIdT): Promise<GameInstanceIdT> {
    const { error, data } = await createGameInstance({ gameConfigId });
    if (error !== undefined) {
      throw new AppError(extractAppErrorCodeFromUnknownObject(error));
    }
    return data.createGameInstanceResult.gameInstanceId;
  }

  async function handleJoinGameByInvite(invitationCode: string): Promise<GameInstanceIdT> {
    const { error, data } = await joinGameByInvite({ invitationCode });
    if (error !== undefined) {
      throw new AppError(extractAppErrorCodeFromUnknownObject(error));
    }
    return data.joinGameByInviteResult.gameInstanceId;
  }

  async function handleStartPlaying(gameInstanceId: GameInstanceIdT): Promise<void> {
    const { error } = await startPlaying({ gameInstanceId });
    if (error !== undefined) {
      throw new AppError(extractAppErrorCodeFromUnknownObject(error));
    }
  }

  async function handleSubmitGuess(gameInstanceId: GameInstanceIdT, levelIdx: number, guess: string): Promise<boolean> {
    const { error, data } = await submitGuess({ gameInstanceId, levelIdx, guess });
    if (error !== undefined) {
      throw new AppError(extractAppErrorCodeFromUnknownObject(error));
    }
    return data.submitGuessResult.isGuessCorrect;
  }

  return {
    onCreateGameInstance: handleCreateGameInstance,
    onJoinGameByInvite: handleJoinGameByInvite,
    onStartPlaying: handleStartPlaying,
    onSubmitGuess: handleSubmitGuess,
  }
}
