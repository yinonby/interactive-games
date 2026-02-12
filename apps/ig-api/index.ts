/* istanbul ignore file -- @preserve */

import { useExpressAppStarterInfo } from '@/express-app/ExpressAppUtils';
import { BeLogger, ExpressApp, MongoInmemDbServer } from '@ig/be-utils';

async function initApp() {
  // start a local mongo inmem server
  const mongoInmemDbServer = new MongoInmemDbServer();
  const uri = await mongoInmemDbServer.startDb();
  const logger = new BeLogger();

  let isShuttingDown = false;
  const shutdown = async (signal: string): Promise<void> => {
    if (isShuttingDown) {
      return;
    }
    isShuttingDown = true;

    logger.info(`Received ${signal} signal. Stopping Mongo Inmem DB server...`);
    await mongoInmemDbServer.stopDb();

    logger.info(`Received ${signal} signal. Stopped Mongo Inmem DB`);
  }

  // these handlers are registered before starting the app, so they will be called first upon signal
  logger.info(`Registering Mongo Inmem DB signal handlers...`);
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);

  const expressApp = new ExpressApp(useExpressAppStarterInfo(uri));
  expressApp.startApp();
}

initApp();
