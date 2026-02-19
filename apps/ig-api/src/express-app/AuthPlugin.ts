/* istanbul ignore file -- @preserve */

import {
  AUTH_JWT_ACCOUNT_ID_FIELD_NAME, AUTH_JWT_COOKIE_NAME, AUTH_JWT_USER_ID_FIELD_NAME
} from '@/utils/AuthDefs';
import {
  AppEngineSignupPlugin, AppEngineSignupPluginTransaction,
  type AuthJwtPropNamesT
} from '@ig/app-engine-be-logic';
import type { EngineDbAdapter } from '@ig/app-engine-be-models';
import { authApiPlugin, type AuthPluginConfigT } from '@ig/auth-api';
import type { AuthDbAdapter } from '@ig/auth-be-models';
import type { ExpressPluginContainerT, JwtAlgorithmT, PackageDb } from '@ig/be-utils';
import { getApiEnvVars } from '@ig/env';
import { isDevel } from '../utils/Utils';

export const useAuthPluginContainer = (
  authDb: PackageDb & AuthDbAdapter,
  engineDb: EngineDbAdapter,
): ExpressPluginContainerT<AuthPluginConfigT> => {
  const { sysDomain, authEnvVars } = getApiEnvVars();

  const tableNamePrefix = '';
  const jwtCookieDomain = sysDomain;
  const jwtCookieIsSecure = !isDevel();
  const authJwtPropNames: AuthJwtPropNamesT = {
    accountIdFieldName: AUTH_JWT_ACCOUNT_ID_FIELD_NAME,
    userIdFieldName: AUTH_JWT_USER_ID_FIELD_NAME,
    cookieName: AUTH_JWT_COOKIE_NAME,
  }

  const authPluginContainer: ExpressPluginContainerT<AuthPluginConfigT> = {
    getPackageDb: () => authDb,
    routeConfig: {
      route: '/api/auth',
      expressPlugin: authApiPlugin,
      pluginConfig: {
        getSignupServiceTransactionAdapter: () => authDb.getSignupServiceTransactionAdapter(
          tableNamePrefix,
          new AppEngineSignupPluginTransaction(engineDb.getAccountsTableAdapter()),
        ),
        getSignupPluginAdapter: () => new AppEngineSignupPlugin(
          authEnvVars.jwtSecret,
          authEnvVars.jwtAlgorithm as JwtAlgorithmT,
          authEnvVars.jwtExpiryMs,
          jwtCookieDomain,
          jwtCookieIsSecure,
          authJwtPropNames,
        ),
      },
    },
  }

  return authPluginContainer;
}