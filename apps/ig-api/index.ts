/* istanbul ignore file -- @preserve */

import { useExpressAppStarterInfo } from '@/ExpressAppUtils';
import { ExpressApp } from '@ig/be-utils';
import dotenv from 'dotenv';

dotenv.config({ override: true, path: ".env.ig-api" }); // load general env file
dotenv.config({ override: true, path: `.env.ig-api.${process.env.NODE_ENV}` }); // load env-specific file
dotenv.config({ override: true, path: `.env.ig-api.${process.env.NODE_ENV}.local` }); // load env-specific secrets file

const expressApp = new ExpressApp(useExpressAppStarterInfo());
expressApp.startApp();
