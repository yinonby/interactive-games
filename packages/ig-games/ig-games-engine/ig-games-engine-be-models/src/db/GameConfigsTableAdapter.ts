
import type { GameConfigIdT, GameConfigT, GameInfoNoIdT } from '@ig/games-engine-models';

export interface GameConfigsTableAdapter {
  getGameConfigs: () => Promise<GameConfigT[]>;
  getGameConfig(gameConfigId: GameConfigIdT): Promise<GameConfigT | null>;
  createGameConfig: (gameConfigId: GameConfigIdT, gameInfoNoId: GameInfoNoIdT) => Promise<void>;
  updateGameConfig(gameConfigId: GameConfigIdT, partialGameInfoNoId: Partial<GameInfoNoIdT>): Promise<void>;
}
