
import type {
  GameConfigIdT,
  GameConfigNoIdT, GameConfigT,
  UpdateGameConfigInputT, UpdateGameConfigResultT
} from '@ig/games-engine-models';

export interface GameConfigLogicAdapter {
  getGameConfigs(): Promise<GameConfigT[]>;
  getGameConfig(gameConfigId: GameConfigIdT): Promise<GameConfigT | null>;
  createGameConfig(gameConfigId: GameConfigIdT, gameConfigNoId: GameConfigNoIdT): Promise<void>;
  updateGameConfig(input: UpdateGameConfigInputT): Promise<UpdateGameConfigResultT>;
}
