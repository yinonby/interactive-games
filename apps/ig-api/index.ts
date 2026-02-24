/* istanbul ignore file -- @preserve */

import { useExpressAppStarterInfo } from '@/express-app/ExpressAppUtils';
import { BeLogger, ExpressApp, MongoInmemDbServer } from '@ig/be-utils';
import {
  startTestingSqlDbContainer
} from '@ig/prisma-utils/test-utils';

async function initApp() {
  const logger = new BeLogger();
  let mongoConnString: string | null = null;
  let sqlDbConnString: string | null = null;

  // in development, start local databases and register shutdown handlers
  if (process.env.NODE_ENV === 'development') {
    // start a local mongo inmem server
    const mongoInmemDbServer = new MongoInmemDbServer();
    mongoConnString = await mongoInmemDbServer.startDb();

    // start a local postgres server
    const sqlDbTestContainer = await startTestingSqlDbContainer();
    sqlDbConnString = sqlDbTestContainer.getConnectionString();

    let isShuttingDown = false;
    const shutdown = async (signal: string): Promise<void> => {
      if (isShuttingDown) {
        return;
      }
      isShuttingDown = true;

      logger.info(`Received ${signal} signal. Stopping Mongo Inmem DB server...`);
      await mongoInmemDbServer.stopDb();

      logger.info(`Received ${signal} signal. Stopping SQL DB server...`);
      await sqlDbTestContainer.stop();

      logger.info(`Received ${signal} signal. Stopped All devel DB servers`);
    }

    // these handlers are registered before starting the app, so they will be called first upon signal
    logger.info(`Registering devel signal handlers...`);
    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } else {
    throw new Error('Only development environment is supported for now');
  }

  const expressApp = new ExpressApp(useExpressAppStarterInfo(mongoConnString, sqlDbConnString));
  expressApp.startApp();
}

initApp();
