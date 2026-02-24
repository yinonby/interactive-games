
import type { GamesChatDbAdapter, GamesDbAdapter } from '@ig/games-engine-be-models';

export type GamesPluginConfigT = {
  gamesDbAdapter: GamesDbAdapter,
  gamesChatDbAdapter: GamesChatDbAdapter,
}
