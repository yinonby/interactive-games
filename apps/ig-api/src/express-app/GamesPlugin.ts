/* istanbul ignore file -- @preserve */

import type { ExpressPluginContainerT } from '@ig/be-utils';
import { gamesApiPlugin, type GamesPluginConfigT } from '@ig/games-engine-api';
import type { GamesMongoDb } from '@ig/games-engine-db';
import { loadGameConfigPreset1 } from '../presets/GameConfigsPreset';
import { isDevel } from '../utils/Utils';

export const useGamesPluginContainer = (gamesMongoDb: GamesMongoDb): ExpressPluginContainerT<GamesPluginConfigT> => {
  const gamesPluginContainer: ExpressPluginContainerT<GamesPluginConfigT> = {
    getPackageDb: () => gamesMongoDb,
    routeConfig: {
      route: '/api/games',
      expressPlugin: gamesApiPlugin,
      pluginConfig: {
        gamesDbAdapter: gamesMongoDb,
      },
    },
    postInitCb: loadPresets,
  }

  return gamesPluginContainer;
}

const loadPresets = async (gamesPluginConfig: GamesPluginConfigT): Promise<void> => {
  if (isDevel()) {
    const presetNamesStr = process.env.DEV_PRESETS;
    if (presetNamesStr === undefined) {
      return;
    }

    const presetNames = presetNamesStr.split(',');
    if (presetNamesStr === 'all' || presetNames.includes('game-configs-preset-1')) {
      await loadGameConfigPreset1(gamesPluginConfig.gamesDbAdapter);
    }
  }
}