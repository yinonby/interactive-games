/* istanbul ignore file -- @preserve */

import type { EngineMongoDb } from '@ig/app-engine-db';
import type { ExpressPluginContainerT } from '@ig/be-utils';

export const useAppEnginePluginContainer = (engineMongoDb: EngineMongoDb): ExpressPluginContainerT<unknown> => {
  const pluginContainer: ExpressPluginContainerT<unknown> = {
    getPackageDb: () => engineMongoDb,
  }

  return pluginContainer;
}