
import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge';
import { makeExecutableSchema } from '@graphql-tools/schema';
import type { AuthLogicAdapter } from '@ig/auth-be-models';
import { authGraphqlTypeDefs } from '@ig/auth-models';
import type { EngineDbAdapter } from '@ig/engine-be-models';
import type { GraphQLSchema } from 'graphql';
import { AuthLogic } from '../../logic/auth/AuthLogic';
import type { AuthPluginConfigT } from '../../types/AuthPluginTypes';
import { createAuthResolvers } from './AuthResolvers';

export const createAuthSchema = (
  engineDbAdapter: EngineDbAdapter,
  pluginConfig: AuthPluginConfigT,
): GraphQLSchema => {
  const authLogicAdapter: AuthLogicAdapter = new AuthLogic(
    pluginConfig.jwtSecret,
    pluginConfig.jwtAlgorithm,
    pluginConfig.jwtExpiresInMs,
    pluginConfig.jwtCookieDomain,
    pluginConfig.jwtCookieIsSecure,
    engineDbAdapter.getUsersTableAdapter(),
  );

  // create the combined schema
  return makeExecutableSchema({
    typeDefs: mergeTypeDefs([
      authGraphqlTypeDefs,
    ]),
    resolvers: mergeResolvers([
      createAuthResolvers(authLogicAdapter),
    ]),
  });
};
