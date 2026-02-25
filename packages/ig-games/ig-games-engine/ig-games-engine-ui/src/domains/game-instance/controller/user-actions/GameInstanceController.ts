
import { AppError, extractAppErrorCodeFromUnknownObject } from '@ig/app-engine-ui';
import type { GameInstanceIdT } from '@ig/games-engine-models';
import {
  useStartGameMutation, useSubmitGuessMutation
} from '../../model/rtk/GameInstanceRtkApi';

export type GameInstanceControllerT = {
  onStartGame: (gameInstanceId: GameInstanceIdT) => Promise<void>,
  onSubmitGuess: (gameInstanceId: GameInstanceIdT, levelIdx: number, guess: string) => Promise<boolean>,
}

export function useGameInstanceController(): GameInstanceControllerT {
  const [ startGame ] = useStartGameMutation();
  const [ submitGuess ] = useSubmitGuessMutation();

  async function handleStartGame(gameInstanceId: GameInstanceIdT): Promise<void> {
    const { error } = await startGame(gameInstanceId);
    if (error !== undefined) {
      throw new AppError(extractAppErrorCodeFromUnknownObject(error));
    }
  }

  async function handleSubmitGuess(gameInstanceId: GameInstanceIdT, levelIdx: number, guess: string): Promise<boolean> {
    const { error, data } = await submitGuess({gameInstanceId, levelIdx, guess});
    if (error !== undefined) {
      throw new AppError(extractAppErrorCodeFromUnknownObject(error));
    }
    return data.isGuessCorrect;
  }

  return {
    onStartGame: handleStartGame,
    onSubmitGuess: handleSubmitGuess,
  }
}
