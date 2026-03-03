
import type { ExpressAppInfoT, ExpressPluginT } from '@ig/be-utils';
import type { Router } from 'express';
import { createGraphqlRouter } from '../graphql/server/GraphqlRouter';
import type { GamesPluginConfigT } from '../types/GamesPluginTypes';

export const gamesApiPlugin: ExpressPluginT<GamesPluginConfigT> = {
  initRouter: async (appInfo: ExpressAppInfoT, publicPluginConfig: GamesPluginConfigT): Promise<Router> => {
    const router = await createGraphqlRouter(
      publicPluginConfig.gamesDbAdapter,
      publicPluginConfig.gamesRequestAdapter,
      publicPluginConfig.gamesUserAdapter,
      publicPluginConfig.wordleAdapter,
    );

    return router;
  },
}
