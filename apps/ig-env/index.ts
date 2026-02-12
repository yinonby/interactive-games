
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const envFilesDir = path.resolve(currentDir, '../..');

dotenv.config({ override: true, path: envFilesDir + "/.env" }); // load general env file
dotenv.config({ override: true, path: envFilesDir + "/.env.local" }); // load general env secrets file
dotenv.config({ override: true, path: envFilesDir + `/.env.${process.env.NODE_ENV}` }); // load env-specific file
dotenv.config({ override: true, path: envFilesDir + `/.env.${process.env.NODE_ENV}.local` }); // load env-specific secrets file

export { getApiEnvVars, getDevHttpProxyEnvVars, getExpoEnvVars } from './src/Env';

