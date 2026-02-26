
import type { ExpressAppInfoT, ExpressPluginT } from '@ig/be-utils';
import type { Router } from 'express';
import { createGraphqlRouter } from '../graphql/server/GraphqlRouter';
import type { AuthPluginConfigT } from '../types/AuthPluginTypes';

export const authApiPlugin: ExpressPluginT<AuthPluginConfigT> = {
  initRouter: async (
    appInfo: ExpressAppInfoT,
    pluginConfig: AuthPluginConfigT,
  ): Promise<Router> => {
    const router = await createGraphqlRouter(pluginConfig);

    return router;
  },
}
