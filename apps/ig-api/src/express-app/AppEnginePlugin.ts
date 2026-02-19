/* istanbul ignore file -- @preserve */

import type { EngineDbAdapter } from '@ig/app-engine-be-models';
import type { ExpressPluginContainerT, PackageDb } from '@ig/be-utils';

export const useAppEnginePluginContainer = (
  engineDb: PackageDb & EngineDbAdapter,
): ExpressPluginContainerT<unknown> => {
  const pluginContainer: ExpressPluginContainerT<unknown> = {
    getPackageDb: () => engineDb,
  }

  return pluginContainer;
}