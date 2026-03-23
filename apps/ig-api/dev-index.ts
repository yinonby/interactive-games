/* istanbul ignore file -- @preserve */

import { useExpressAppStarterInfo } from '@/express-app/ExpressAppUtils';
import { BeLogger, ExpressApp, MongoInmemDbServer } from '@ig/be-utils';
import {
  startPostgresContainer
} from '@ig/dev-containers';
import { getApiEnvVars } from '@ig/env';

if (process.env.NODE_ENV !== 'development') {
  throw new Error('Please run dev-index only in development env');
}

async function initApp() {
  const logger = new BeLogger();
  const apiEnvVars = getApiEnvVars();

  // start a local mongo inmem server
  const mongoInmemDbServer = new MongoInmemDbServer(new BeLogger(), apiEnvVars.mongoDb.listenPort);
  const mongoConnString = await mongoInmemDbServer.startDb();

  // start a local postgres server
  const postgresContainerAdapter = await startPostgresContainer();
  const sqlDbConnString = postgresContainerAdapter.getConnectionString();

  // start a redis container
  const redisUrl = `redis://localhost:${apiEnvVars.redis.listenPort}`;
  logger.info(`Connected to Redis server container ${redisUrl}`);

  let isShuttingDown = false;
  const shutdown = async (signal: string): Promise<void> => {
    if (isShuttingDown) {
      return;
    }
    isShuttingDown = true;

    logger.info(`Received ${signal} signal. Stopping Mongo Inmem DB server...`);
    await mongoInmemDbServer.stopDb();

    logger.info(`Received ${signal} signal. Stopping SQL DB server container...`);
    await postgresContainerAdapter.stop();

    logger.info(`Received ${signal} signal. Stopped All devel DB servers`);
  }

  // these handlers are registered before starting the app, so they will be called first upon signal
  logger.info(`Registering devel signal handlers...`);
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);

  const expressApp = new ExpressApp(useExpressAppStarterInfo(mongoConnString, sqlDbConnString, redisUrl));
  expressApp.startApp();
}

initApp();
