
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import { mergeSchemas } from '@graphql-tools/schema';
import type { EngineDbAdapter } from '@ig/app-engine-be-models';
import { Router } from 'express';
import type { ApolloContextT, AuthPluginConfigT } from '../../types/AuthPluginTypes';
import { createAuthSchema } from '../auth/AuthSchema';

// returns an express router for this graphql endpoint
export async function createGraphqlRouter(
  engineDbAdapter: EngineDbAdapter,
  pluginConfig: AuthPluginConfigT,
): Promise<Router> {
  const router = Router();
  const authSchema = createAuthSchema(engineDbAdapter, pluginConfig);

  // create the combined schema
  const schema = mergeSchemas({
    schemas:[ authSchema ], // more schemas to come
  });

  // set up Apollo Server
  const apolloServer = new ApolloServer<ApolloContextT>({
    schema,
  });
  await apolloServer.start();

  // inject the /graphql route
  router.use(
    '/graphql',
    expressMiddleware(apolloServer, {
      // eslint-disable-next-line @typescript-eslint/require-await
      context: async ({ req, res }): Promise<ApolloContextT> => ({
        req,
        res,
      }),
    }),
  );

  return router;
}
