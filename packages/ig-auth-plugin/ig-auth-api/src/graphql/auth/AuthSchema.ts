
import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge';
import { makeExecutableSchema } from '@graphql-tools/schema';
import type { SignupPluginAdapter, SignupServiceTransactionAdapter } from '@ig/auth-be-models';
import { authGraphqlTypeDefs } from '@ig/auth-models';
import type { GraphQLSchema } from 'graphql';
import { AuthLogic } from '../../logic/AuthLogic';
import { SignupService } from '../../logic/SignupService';
import type { AuthPluginConfigT } from '../../types/AuthPluginTypes';
import { createAuthResolvers } from './AuthResolvers';

export const createAuthSchema = (
  publicPluginConfig: AuthPluginConfigT,
): GraphQLSchema => {
  const signupPluginAdapter: SignupPluginAdapter | undefined = publicPluginConfig.getSignupPluginAdapter();
  const signupServiceTransactionAdapter: SignupServiceTransactionAdapter =
    publicPluginConfig.getSignupServiceTransactionAdapter();
  const signupServiceAdapter = new SignupService(signupServiceTransactionAdapter, signupPluginAdapter);
  const authLogic = new AuthLogic(signupServiceAdapter);

  // create the combined schema
  return makeExecutableSchema({
    typeDefs: mergeTypeDefs([
      authGraphqlTypeDefs,
    ]),
    resolvers: mergeResolvers([
      createAuthResolvers(authLogic),
    ]),
  });
};
