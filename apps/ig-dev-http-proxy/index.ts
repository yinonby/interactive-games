
import { BeLogger } from '@ig/be-utils';
import { getEnvVarInt, getEnvVarStr } from '@ig/utils';
import dotenv from 'dotenv';
import { Redbird } from 'redbird';

dotenv.config({ override: true, path: ".env.ig-dev-http-proxy" }); // load general env file

async function initApp(): Promise<void> {
  const baseDomain = getEnvVarStr('IG_DEV_HTTP_PROXY__BASE_DOMAIN');
  const listenPort = getEnvVarInt('IG_DEV_HTTP_PROXY__LISTEN_PORT');
  const expoPort = getEnvVarInt('IG_DEV_HTTP_PROXY__EXPO_PORT');
  const apiPort = getEnvVarInt('IG_DEV_HTTP_PROXY__API_PORT');
  const wssPort = getEnvVarInt('IG_DEV_HTTP_PROXY__WSS_PORT');

  const proxy = new Redbird({ port: listenPort });
  const logger = new BeLogger();

  // API
  await proxy.register(`${baseDomain}/api`, `http://${baseDomain}:${apiPort}/api`);

  // WebSockets
  await proxy.register(`${baseDomain}/wss`, `http://${baseDomain}:${wssPort}/wss`);

  // All other - expo
  await proxy.register(`${baseDomain}/`, `http://${baseDomain}:${expoPort}`);

  logger.info('Dev http proxy is running...');
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
initApp();
