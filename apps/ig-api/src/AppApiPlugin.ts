/* istanbul ignore file -- @preserve */

import type { ExpressAppInfoT, ExpressPluginT } from '@ig/be-lib';
import type { GetAppConfigResponseT } from '@ig/engine-models';
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