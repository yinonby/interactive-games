
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import { mergeSchemas } from '@graphql-tools/schema';
import type { GamesDbAdapter } from '@ig/games-be-models';
import { Router } from 'express';
import { createGameConfigSchema } from '../game-config/GameConfigSchema';
import { makeGamesGraphqlAuthDirectiveTransformer } from './GraphqlAuthDirective';

// returns an express router for this graphql endpoint
export async function createGraphqlRouter(
  gamesDbAdapter: GamesDbAdapter,
): Promise<Router> {
  const router = Router();
  const gameConfigSchema = createGameConfigSchema(gamesDbAdapter);

  // create the combined schema
  let schema = mergeSchemas({
    schemas:[ gameConfigSchema ], // more schemas to come
  });

  // inject directives
  const authDirectiveGraphqlTransformer =  makeGamesGraphqlAuthDirectiveTransformer();
  const directiveTransformers = [
    authDirectiveGraphqlTransformer,
  ]
  schema = directiveTransformers.reduce((curSchema, transformer) => transformer(curSchema), schema);

  // set up Apollo Server
  const apolloServer = new ApolloServer({
    schema,
  });
  await apolloServer.start();

  // inject the /graphql route
  router.use(
    '/graphql',
    expressMiddleware(apolloServer),
  );

  return router;
}
