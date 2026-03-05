
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import { mergeSchemas } from '@graphql-tools/schema';
import { type Request, type Response, Router } from 'express';
import type { AuthGraphqlContextT } from '../../types/AuthInternalTypes';
import type { AuthPluginConfigT } from '../../types/AuthPluginTypes';
import { createAuthSchema } from '../auth/AuthSchema';
import { buildContext } from './GraphqlUtils';

// returns an express router for this graphql endpoint
export async function createGraphqlRouter(
  publicPluginConfig: AuthPluginConfigT,
): Promise<Router> {
  const router = Router();
  const authSchema = createAuthSchema(publicPluginConfig);

  // create the combined schema
  const schema = mergeSchemas({
    schemas:[ authSchema ], // more schemas to come
  });

  // set up Apollo Server
  const apolloServer = new ApolloServer<AuthGraphqlContextT>({
    schema,
  });

  const contextFn = async ({ req, res }: { req: Request, res: Response }): Promise<AuthGraphqlContextT> => {
    return buildContext(req, res, publicPluginConfig.getSignupPluginAdapter());
  };

  await apolloServer.start();

  // inject the /graphql route
  router.use(
    '/graphql',
    expressMiddleware(apolloServer, {
      context: contextFn,
    }),
  );

  return router;
}
