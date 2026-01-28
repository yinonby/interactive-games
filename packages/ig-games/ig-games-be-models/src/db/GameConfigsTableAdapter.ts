
import type { GameConfigIdT, GameConfigT, UpdateGameConfigInputT } from '@ig/games-models';

export interface GameConfigsTableAdapter {
  getGameConfigs: () => Promise<GameConfigT[]>;
  getGameConfig(gameConfigId: GameConfigIdT): Promise<GameConfigT | null>;
  createGameConfig: (gameConfig: GameConfigT) => Promise<void>;
  updateGameConfig(input: UpdateGameConfigInputT): Promise<void>;
}
