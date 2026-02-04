/* istanbul ignore file -- @preserve */

import { EngineMongoDb } from '@ig/app-engine-db';
import { type AuthPluginConfigT, authApiPlugin } from '@ig/auth-api';
import type { ExpressAppStarterInfoT, ExpressPluginContainerT, JwtAlgorithmT } from '@ig/be-utils';
import { gamesApiPlugin } from '@ig/games-engine-api';
import type { GamesDbAdapter } from '@ig/games-engine-be-models';
import { GamesMongoDb } from '@ig/games-engine-db';
import { DAYS_TO_MS, getEnvVarInt, getEnvVarStr } from '@ig/utils';
import { useAppApiPlugin } from './AppApiPlugin';
import { loadGameConfigPreset1 } from './presets/GameConfigsPreset';
import { isDevel } from './Utils';

export const useExpressAppStarterInfo = (): ExpressAppStarterInfoT => {
  const listerPort: number = getEnvVarInt('IG_API__APP_LISTEN_PORT');
  const appUrl: string = getEnvVarStr('IG_API__APP_URL');
  const baseDomain = getEnvVarStr('IG_API__BASE_DOMAIN');
  const jwtSecret = getEnvVarStr('IG_API__AUTH_JWT_SECRET');
  const jwtAlgorithm = getEnvVarStr('IG_API__AUTH_JWT_ALGORITHM');
  const jwtExpiresInDays = getEnvVarInt('IG_API__AUTH_JWT_EXPIRY_DAYS');
  const corsAllowOrigins: string[] | undefined = [appUrl];

  const appPluginContainer: ExpressPluginContainerT<unknown> = {
    route: '/api',
    expressPlugin: useAppApiPlugin(),
  }

  const authPluginContainer: ExpressPluginContainerT<unknown, AuthPluginConfigT> = {
    getDbAdapterCb: () => new EngineMongoDb(),
    route: '/api/auth',
    expressPlugin: authApiPlugin,
    pluginConfig: {
      jwtSecret: jwtSecret,
      jwtAlgorithm: jwtAlgorithm as JwtAlgorithmT,
      jwtExpiresInMs: DAYS_TO_MS(jwtExpiresInDays),
      jwtCookieDomain: baseDomain,
      jwtCookieIsSecure: !isDevel(),
    },
  }

  const gamesPluginContainer: ExpressPluginContainerT<GamesDbAdapter> = {
    getDbAdapterCb: () => new GamesMongoDb(),
    route: '/api/games',
    expressPlugin: gamesApiPlugin,
    postInitCb: loadPresets,
  }

  return {
    listerPort: listerPort,
    corsAllowOrigins: corsAllowOrigins,
    appInfo: {
      appVersion: '1.0.0',
    },
    dbInfo: {
      dbType: 'inmem-mongodb',
      tableNamePrefix: '',
    },
    expressPluginContainers: [
      appPluginContainer as ExpressPluginContainerT<unknown>,
      authPluginContainer as ExpressPluginContainerT<unknown>,
      gamesPluginContainer as ExpressPluginContainerT<unknown>,
    ],
  }
}

const loadPresets = async (gamesDbAdapter: GamesDbAdapter | null): Promise<void> => {
  if (isDevel()) {
    const presetNamesStr = process.env.DEV_PRESETS;
    if (presetNamesStr === undefined) {
      return;
    }
    if (gamesDbAdapter === null) {
      throw new Error('Unexpected missing getDbAdapterCb');
    }
    const presetNames = presetNamesStr.split(',');
    if (presetNamesStr === 'all' || presetNames.includes('game-configs-preset-1')) {
      await loadGameConfigPreset1(gamesDbAdapter);
    }
  }
}
