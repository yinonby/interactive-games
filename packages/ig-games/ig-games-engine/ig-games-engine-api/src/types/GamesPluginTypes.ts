
import type { GamesDbAdapter, GamesRequestAdapter, GamesUserAdapter } from '@ig/games-engine-be-models';
import type { GamesApiServerErrorCodeT, GameUserIdT } from '@ig/games-engine-models';
import type { WordleAdapter } from '@ig/games-wordle-be-models';
import { type Request } from 'express';

export type GamesPluginConfigT = {
  gamesDbAdapter: GamesDbAdapter,
  gamesRequestAdapter: GamesRequestAdapter,
  gamesUserAdapter: GamesUserAdapter,
  wordleAdapter: WordleAdapter,
}

export type GamesGraphqlContextT = {
  gameUserId: GameUserIdT,
  headers: Request['headers'],
};

export class GamesApiError extends Error {
  constructor(message: string, public gamesErrCode: GamesApiServerErrorCodeT) {
    super(message);
  }
}
