/* istanbul ignore file -- @preserve */

import { EngineMongoDb } from '@ig/app-engine-mongo-db';
import { type AuthPluginConfigT } from '@ig/auth-api';
import { AuthMongoDb } from '@ig/auth-mongo-db';
import { type ExpressAppStarterInfoT, type ExpressPluginContainerT } from '@ig/be-utils';
import { getApiEnvVars } from '@ig/env';
import { type GamesPluginConfigT } from '@ig/games-engine-api';
import { GamesMongoDb } from '@ig/games-engine-mongo-db';
import { useAppApiPluginContainer } from './AppApiPlugin';
import { useAppEnginePluginContainer } from './AppEnginePlugin';
import { useAuthPluginContainer } from './AuthPlugin';
import { useGamesPluginContainer } from './GamesPlugin';

export const useExpressAppStarterInfo = (mongoConnString: string): ExpressAppStarterInfoT => {
  const apiEnvVars = getApiEnvVars();

  const corsAllowOrigins: string[] | undefined = [apiEnvVars.webCorsOrigin];
  const authMongoDb: AuthMongoDb = new AuthMongoDb();
  const engineMongoDb: EngineMongoDb = new EngineMongoDb();
  const gamesMongoDb: GamesMongoDb = new GamesMongoDb();

  const appPluginContainer: ExpressPluginContainerT<unknown> = useAppApiPluginContainer();
  const appEnginePluginContainer: ExpressPluginContainerT<unknown> = useAppEnginePluginContainer(engineMongoDb);
  const authPluginContainer: ExpressPluginContainerT<AuthPluginConfigT> = useAuthPluginContainer(authMongoDb,
    engineMongoDb);
  const gamesPluginContainer: ExpressPluginContainerT<GamesPluginConfigT> = useGamesPluginContainer(gamesMongoDb);

  return {
    listerPort: apiEnvVars.apiListenPort,
    corsAllowOrigins: corsAllowOrigins,
    appInfo: {
      appVersion: '1.0.0',
    },
    dbInfo: {
      dbType: 'mongodb',
      mongoConnString: mongoConnString,
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
