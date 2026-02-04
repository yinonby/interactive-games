
import type { GameConfigT, UpdateGameConfigInputT, UpdateGameConfigResultT } from '@ig/games-engine-models';

export interface GameConfigLogicAdapter {
  getGameConfigs(): Promise<GameConfigT[]>;
  createGameConfig(gameConfig: GameConfigT): Promise<void>;
  updateGameConfig(input: UpdateGameConfigInputT): Promise<UpdateGameConfigResultT>;
}
