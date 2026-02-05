/* istanbul ignore file -- @preserve */

import type { GetAppConfigResponseT } from '@ig/app-engine-models';
import type { ExpressAppInfoT, ExpressPluginContainerT, ExpressPluginT } from '@ig/be-utils';
import { Router, type Request, type Response } from 'express';

export const useAppApiPlugin = (): ExpressPluginT<unknown> => {
  return {
    // eslint-disable-next-line @typescript-eslint/require-await
    initRouter: async (appInfo: ExpressAppInfoT): Promise<Router> => {
      const router = Router();

      // eslint-disable-next-line @typescript-eslint/require-await
      router.get('/app-config', async (req: Request, res: Response) => {
        const json: GetAppConfigResponseT = {
          appConfig: {
            version: appInfo.appVersion,
          }
        }

        res.json(json);
      });

      return router;
    },
  }
}

export const useAppApiPluginContainer = (): ExpressPluginContainerT<unknown> => {
  const appPluginContainer: ExpressPluginContainerT<unknown> = {
    routeConfig: {
      route: '/api',
      expressPlugin: useAppApiPlugin(),
      pluginConfig: undefined,
    }
  }

  return appPluginContainer;
}
