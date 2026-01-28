
import type { ExpressAppInfoT, ExpressPluginT } from '@ig/be-lib';
import type { GamesDbAdapter } from '@ig/games-be-models';
import type { Router } from 'express';
import { createGraphqlRouter } from '../graphql/server/GraphqlRouter';

export const gamesApiPlugin: ExpressPluginT<GamesDbAdapter> = {
  initRouter: async (appInfo: ExpressAppInfoT, gamesDbAdapter: GamesDbAdapter | null): Promise<Router> => {
    if (gamesDbAdapter === null) {
      throw new Error('Unexpected missing getDbAdapterCb');
    }
    const router = await createGraphqlRouter(gamesDbAdapter);

    return router;
  },
}
