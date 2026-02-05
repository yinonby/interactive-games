/* istanbul ignore file -- @preserve */

import { AuthLogic } from '@ig/app-engine-be-logic';
import type { EngineDbAdapter } from '@ig/app-engine-be-models';
import { authApiPlugin, type AuthPluginConfigT } from '@ig/auth-api';
import type { ExpressPluginContainerT, JwtAlgorithmT } from '@ig/be-utils';
import { DAYS_TO_MS, getEnvVarInt, getEnvVarStr } from '@ig/utils';
import { isDevel } from '../utils/Utils';

export const useAuthPluginContainer = (engineDbAdapter: EngineDbAdapter): ExpressPluginContainerT<AuthPluginConfigT> => {
  const baseDomain = getEnvVarStr('IG_API__BASE_DOMAIN');
  const jwtSecret = getEnvVarStr('IG_API__AUTH_JWT_SECRET');
  const jwtAlgorithm = getEnvVarStr('IG_API__AUTH_JWT_ALGORITHM');
  const jwtExpiresInDays = getEnvVarInt('IG_API__AUTH_JWT_EXPIRY_DAYS');
  const authPluginContainer: ExpressPluginContainerT<AuthPluginConfigT> = {
    routeConfig: {
      route: '/api/auth',
      expressPlugin: authApiPlugin,
      pluginConfig: {
        getAuthLogicAdapter: () => new AuthLogic(
          jwtSecret,
          jwtAlgorithm as JwtAlgorithmT,
          DAYS_TO_MS(jwtExpiresInDays),
          baseDomain,
          !isDevel(),
          engineDbAdapter.getUsersTableAdapter(),
        ),
      },
    },
  }

  return authPluginContainer;
}