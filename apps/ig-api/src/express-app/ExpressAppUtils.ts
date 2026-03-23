/* istanbul ignore file -- @preserve */

import { EngineMongoDb } from '@ig/app-engine-mongo-db';
import { type AuthPluginConfigT } from '@ig/auth-api';
import { AuthMongoDb } from '@ig/auth-mongo-db';
import { type ExpressAppStarterInfoT, type ExpressPluginContainerT } from '@ig/be-utils';
import type { ChatPluginConfigT } from '@ig/chat-api';
import { ChatPrismaDb } from '@ig/chat-prisma-db';
import { getApiEnvVars } from '@ig/env';
import { type GamesPluginConfigT } from '@ig/games-engine-api';
import { GamesMongoDb } from '@ig/games-engine-mongo-db';
import { PrismaPg } from '@prisma/adapter-pg';
import { useAppApiPluginContainer } from './AppApiPlugin';
import { useAppEnginePluginContainer } from './AppEnginePlugin';
import { useAuthPluginContainer } from './AuthPlugin';
import { useChatPluginContainer } from './ChatPlugin';
import { useGamesPluginContainer } from './GamesPlugin';

export const useExpressAppStarterInfo = (
  mongoConnString: string,
  sqlDbConnString: string,
  redisUrl: string,
): ExpressAppStarterInfoT => {
  const apiEnvVars = getApiEnvVars();

  // init prisma postgres adapter
  const prismaPg: PrismaPg = new PrismaPg({ connectionString: sqlDbConnString });

  const corsAllowOrigins: string[] | undefined = [apiEnvVars.webCorsOrigin];
  const authMongoDb: AuthMongoDb = new AuthMongoDb();
  const engineMongoDb: EngineMongoDb = new EngineMongoDb();
  const gamesMongoDb: GamesMongoDb = new GamesMongoDb();
  const gamesPrismaDb: ChatPrismaDb = new ChatPrismaDb(prismaPg);

  const appPluginContainer: ExpressPluginContainerT<unknown> = useAppApiPluginContainer();
  const appEnginePluginContainer: ExpressPluginContainerT<unknown> = useAppEnginePluginContainer(engineMongoDb);
  const authPluginContainer: ExpressPluginContainerT<AuthPluginConfigT> = useAuthPluginContainer(authMongoDb,
    engineMongoDb);
  const chatPluginContainer: ExpressPluginContainerT<ChatPluginConfigT> = useChatPluginContainer(redisUrl,
    gamesPrismaDb, apiEnvVars.redis);
  const gamesPluginContainer: ExpressPluginContainerT<GamesPluginConfigT> =
    useGamesPluginContainer(gamesMongoDb, engineMongoDb);

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
      chatPluginContainer as ExpressPluginContainerT<unknown>,
      gamesPluginContainer as ExpressPluginContainerT<unknown>,
    ],
  }
}
