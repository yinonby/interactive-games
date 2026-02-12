/* istanbul ignore file -- @preserve */

import { AuthLogic } from '@ig/app-engine-be-logic';
import type { EngineDbAdapter } from '@ig/app-engine-be-models';
import { authApiPlugin, type AuthPluginConfigT } from '@ig/auth-api';
import type { ExpressPluginContainerT, JwtAlgorithmT } from '@ig/be-utils';
import { getApiEnvVars } from '@ig/env';
import { isDevel } from '../utils/Utils';

export const useAuthPluginContainer = (
  engineDbAdapter: EngineDbAdapter
): ExpressPluginContainerT<AuthPluginConfigT> => {
  const { sysDomain, authEnvVars } = getApiEnvVars();

  const authPluginContainer: ExpressPluginContainerT<AuthPluginConfigT> = {
    routeConfig: {
      route: '/api/auth',
      expressPlugin: authApiPlugin,
      pluginConfig: {
        getAuthLogicAdapter: () => new AuthLogic(
          authEnvVars.jwtSecret,
          authEnvVars.jwtAlgorithm as JwtAlgorithmT,
          authEnvVars.jwtExpiryMs,
          sysDomain,
          !isDevel(),
          engineDbAdapter.getUsersTableAdapter(),
        ),
      },
    },
  }

  return authPluginContainer;
}