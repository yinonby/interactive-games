
import type { EngineDbAdapter } from '@ig/app-engine-be-models';
import type { ExpressAppInfoT, ExpressPluginT } from '@ig/be-utils';
import type { Router } from 'express';
import { createGraphqlRouter } from '../graphql/server/GraphqlRouter';
import type { AuthPluginConfigT } from '../types/AuthPluginTypes';

export const authApiPlugin: ExpressPluginT<EngineDbAdapter, AuthPluginConfigT> = {
  initRouter: async (
    appInfo: ExpressAppInfoT,
    engineDbAdapter: EngineDbAdapter | null,
    pluginConfig: AuthPluginConfigT,
  ): Promise<Router> => {
    if (engineDbAdapter === null) {
      throw new Error('Unexpected missing getDbAdapterCb');
    }
    const router = await createGraphqlRouter(engineDbAdapter, pluginConfig);

    return router;
  },
}
