/* istanbul ignore file -- @preserve */

import type { ExpressPluginContainerT, PackageDb } from '@ig/be-utils';
import { gamesApiPlugin, type GamesPluginConfigT } from '@ig/games-engine-api';
import type { GamesChatDbAdapter, GamesDbAdapter } from '@ig/games-engine-be-models';
import { loadGameConfigPreset1 } from '../presets/GameConfigsPreset';
import { isDevel } from '../utils/Utils';

export const useGamesPluginContainer = (
  gamesDb: PackageDb & GamesDbAdapter,
  gamesChatDbAdapter: GamesChatDbAdapter,
): ExpressPluginContainerT<GamesPluginConfigT> => {
  const gamesPluginContainer: ExpressPluginContainerT<GamesPluginConfigT> = {
    getPackageDb: () => gamesDb,
    routeConfig: {
      route: '/api/games',
      expressPlugin: gamesApiPlugin,
      pluginConfig: {
        gamesDbAdapter: gamesDb,
        gamesChatDbAdapter: gamesChatDbAdapter,
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
    if (presetNamesStr === 'all' || presetNames.includes('game-infos-preset-1')) {
      await loadGameConfigPreset1(gamesPluginConfig.gamesDbAdapter);
    }
  }
}