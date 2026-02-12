
import { BeLogger } from '@ig/be-utils';
import { getDevHttpProxyEnvVars } from '@ig/env';
import { Redbird } from 'redbird';

async function initApp(): Promise<void> {
  const { devHttpProxyListenPort, sysDomain, webListenPort, apiListenPort, wssListenPort } = getDevHttpProxyEnvVars();

  const proxy = new Redbird({ port: devHttpProxyListenPort });
  const logger = new BeLogger();

  // API
  await proxy.register(`${sysDomain}/api`, `http://${sysDomain}:${apiListenPort}/api`);

  // WebSockets
  await proxy.register(`${sysDomain}/wss`, `http://${sysDomain}:${wssListenPort}/wss`);

  // All other - expo
  await proxy.register(`${sysDomain}/`, `http://${sysDomain}:${webListenPort}`);

  logger.info('Dev http proxy is running...');
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
initApp();
