/* istanbul ignore file -- @preserve */

import { EngineMongoDb } from '@ig/app-engine-db';
import { type AuthPluginConfigT } from '@ig/auth-api';
import type { ExpressAppStarterInfoT, ExpressPluginContainerT } from '@ig/be-utils';
import { type GamesPluginConfigT } from '@ig/games-engine-api';
import { GamesMongoDb } from '@ig/games-engine-db';
import { getEnvVarInt, getEnvVarStr } from '@ig/utils';
import { useAppApiPluginContainer } from './AppApiPlugin';
import { useAppEnginePluginContainer } from './AppEnginePlugin';
import { useAuthPluginContainer } from './AuthPlugin';
import { useGamesPluginContainer } from './GamesPlugin';

export const useExpressAppStarterInfo = (): ExpressAppStarterInfoT => {
  const listerPort: number = getEnvVarInt('IG_API__APP_LISTEN_PORT');
  const appUrl: string = getEnvVarStr('IG_API__APP_URL');
  const corsAllowOrigins: string[] | undefined = [appUrl];
  const engineMongoDb: EngineMongoDb = new EngineMongoDb();
  const gamesMongoDb: GamesMongoDb = new GamesMongoDb();
  const appPluginContainer: ExpressPluginContainerT<unknown> = useAppApiPluginContainer();
  const appEnginePluginContainer: ExpressPluginContainerT<unknown> = useAppEnginePluginContainer(engineMongoDb);
  const authPluginContainer: ExpressPluginContainerT<AuthPluginConfigT> = useAuthPluginContainer(engineMongoDb);
  const gamesPluginContainer: ExpressPluginContainerT<GamesPluginConfigT> = useGamesPluginContainer(gamesMongoDb);

  return {
    listerPort: listerPort,
    corsAllowOrigins: corsAllowOrigins,
    appInfo: {
      appVersion: '1.0.0',
    },
    dbInfo: {
      dbType: 'inmem-mongodb',
      tableNamePrefix: '',
    },
    expressPluginContainers: [
      appPluginContainer as ExpressPluginContainerT<unknown>,
      appEnginePluginContainer as ExpressPluginContainerT<unknown>,
      authPluginContainer as ExpressPluginContainerT<unknown>,
      gamesPluginContainer as ExpressPluginContainerT<unknown>,
    ],
  }
}
