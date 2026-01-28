
import type { GameConfigsTableAdapter } from './GameConfigsTableAdapter';

export interface GamesDbAdapter {
  getGameConfigsTableAdapter: (
    tableNamePrefix?: string,
  ) => GameConfigsTableAdapter;
}
