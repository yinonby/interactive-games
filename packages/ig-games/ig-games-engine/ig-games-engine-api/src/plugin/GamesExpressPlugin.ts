
import type { ExpressAppInfoT, ExpressPluginT } from '@ig/be-utils';
import type { Router } from 'express';
import { createGraphqlRouter } from '../graphql/server/GraphqlRouter';
import type { GamesPluginConfigT } from '../types/GamesPluginTypes';

export const gamesApiPlugin: ExpressPluginT<GamesPluginConfigT> = {
  initRouter: async (appInfo: ExpressAppInfoT, pluginConfig: GamesPluginConfigT): Promise<Router> => {
    const router = await createGraphqlRouter(pluginConfig.gamesDbAdapter);

    return router;
  },
}
