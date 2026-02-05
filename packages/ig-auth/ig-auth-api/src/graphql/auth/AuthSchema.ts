
import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { authGraphqlTypeDefs } from '@ig/auth-models';
import type { GraphQLSchema } from 'graphql';
import type { AuthPluginConfigT } from '../../types/AuthPluginTypes';
import { createAuthResolvers } from './AuthResolvers';

export const createAuthSchema = (
  pluginConfig: AuthPluginConfigT,
): GraphQLSchema => {
  // create the combined schema
  return makeExecutableSchema({
    typeDefs: mergeTypeDefs([
      authGraphqlTypeDefs,
    ]),
    resolvers: mergeResolvers([
      createAuthResolvers(pluginConfig.getAuthLogicAdapter()),
    ]),
  });
};
