
import type { ExpressAppInfoT, ExpressPluginT } from '@ig/be-utils';
import type { Router } from 'express';
import { createGraphqlRouter } from '../graphql/server/GraphqlRouter';
import type { ChatPluginConfigT } from '../types/ChatPluginTypes';

export const chatApiPlugin: ExpressPluginT<ChatPluginConfigT> = {
  initRouter: async (appInfo: ExpressAppInfoT, publicPluginConfig: ChatPluginConfigT): Promise<Router> => {
    // init prisma db
    await publicPluginConfig.chatDbAdapter.init();

    const router = await createGraphqlRouter(publicPluginConfig.chatDbAdapter);

    return router;
  },
}
