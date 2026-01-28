/* istanbul ignore file -- @preserve */

import type { ExpressAppStarterInfoT, ExpressPluginContainerT } from '@ig/be-lib';
import { gamesApiPlugin } from '@ig/games-api';
import type { GamesDbAdapter } from '@ig/games-be-models';
import { GamesMongoDb } from '@ig/games-db';
import { getEnvVarInt, getEnvVarStr } from '@ig/lib';
import { loadGameConfigPreset1 } from './presets/GameConfigsPreset';

const isDevel = (): boolean => process.env.NODE_ENV === 'development';

export const useExpressAppStarterInfo = (): ExpressAppStarterInfoT => {
  const listerPort: number = getEnvVarInt('IG_API__APP_LISTEN_PORT');
  const appUrl: string = getEnvVarStr('IG_API__APP_URL');

  const corsAllowOrigins: string[] | undefined = [appUrl];
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
