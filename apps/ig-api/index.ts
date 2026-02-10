/* istanbul ignore file -- @preserve */

import { useExpressAppStarterInfo } from '@/express-app/ExpressAppUtils';
import { ExpressApp, MongoInmemDbServer } from '@ig/be-utils';
import dotenv from 'dotenv';

dotenv.config({ override: true, path: ".env.ig-api" }); // load general env file
dotenv.config({ override: true, path: `.env.ig-api.${process.env.NODE_ENV}` }); // load env-specific file
dotenv.config({ override: true, path: `.env.ig-api.${process.env.NODE_ENV}.local` }); // load env-specific secrets file

async function initApp() {
  // start a local mongo inmem server
  const mongoInmemDbServer = new MongoInmemDbServer();
  const uri = await mongoInmemDbServer.startDb();

  const expressApp = new ExpressApp(useExpressAppStarterInfo(uri));
  expressApp.startApp();
}

initApp();
