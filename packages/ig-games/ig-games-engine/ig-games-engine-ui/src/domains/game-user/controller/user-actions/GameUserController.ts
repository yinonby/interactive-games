
import { AppError, extractAppErrorCodeFromUnknownObject } from '@ig/app-engine-ui';
import type { GameConfigIdT } from '@ig/games-engine-models';
import {
  useAddGameConfigIdMutation
} from '../../model/rtk/GameUserRtkApi';

export type GameUserControllerT = {
  onAddGameConfigId: (gameConfigId: GameConfigIdT) => Promise<void>,
}

export function useGameUserController(): GameUserControllerT {
  const [ addGameConfigId ] = useAddGameConfigIdMutation();

  async function handleAddGameConfigId(gameConfigId: GameConfigIdT): Promise<void> {
    const { error } = await addGameConfigId({ gameConfigId });
    if (error !== undefined) {
      throw new AppError(extractAppErrorCodeFromUnknownObject(error));
    }
  }

  return {
    onAddGameConfigId: handleAddGameConfigId,
  }
}
