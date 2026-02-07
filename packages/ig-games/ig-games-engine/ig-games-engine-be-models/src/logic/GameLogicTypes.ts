
import type { GameConfigIdT, GameConfigT, GameInfoNoIdT, GameInfoT, UpdateGameConfigInputT, UpdateGameConfigResultT } from '@ig/games-engine-models';

export interface GameConfigLogicAdapter {
  getGameConfigs(): Promise<GameConfigT[]>;
  getGameConfig(gameConfigId: GameConfigIdT): Promise<GameConfigT | null>;
  getGameInfos(): Promise<GameInfoT[]>;
  getGameInfo(gameConfigId: GameConfigIdT): Promise<GameInfoT | null>;
  createGameConfig(gameConfigId: GameConfigIdT, gameInfoNoId: GameInfoNoIdT): Promise<void>;
  updateGameConfig(input: UpdateGameConfigInputT): Promise<UpdateGameConfigResultT>;
}
