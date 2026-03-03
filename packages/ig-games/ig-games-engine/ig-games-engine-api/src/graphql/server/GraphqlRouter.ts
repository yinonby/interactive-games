
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import { mergeSchemas } from '@graphql-tools/schema';
import { type GamesDbAdapter, type GamesRequestAdapter, type GamesUserAdapter } from '@ig/games-engine-be-models';
import type { WordleAdapter } from '@ig/games-wordle-be-models';
import { type Request, Router } from 'express';
import type { GamesGraphqlContextT } from '../../types/GamesPluginTypes';
import { createGameConfigSchema } from '../game-config/GameConfigSchema';
import { createGameInstanceSchema } from '../game-instance/GameInstanceSchema';
import { createGameUserSchema } from '../game-user/GameUserSchema';
import { makeGamesGraphqlAuthDirectiveTransformer } from './GraphqlAuthDirective';
import { buildContext, formatErrorFn } from './GraphqlUtils';

// returns an express router for this graphql endpoint
export async function createGraphqlRouter(
  gamesDbAdapter: GamesDbAdapter,
  gamesRequestAdapter: GamesRequestAdapter,
  gamesUserAdapter: GamesUserAdapter,
  wordleAdapter: WordleAdapter,
): Promise<Router> {
  const router = Router();
  const gameUserSchema = createGameUserSchema(gamesDbAdapter);
  const gameConfigSchema = createGameConfigSchema(gamesDbAdapter);
  const gameInstanceSchema = createGameInstanceSchema(gamesDbAdapter, gamesUserAdapter, wordleAdapter);

  // create the combined schema
  let schema = mergeSchemas({
    schemas:[ gameUserSchema, gameConfigSchema, gameInstanceSchema ],
  });

  // inject directives
  const authDirectiveGraphqlTransformer = makeGamesGraphqlAuthDirectiveTransformer();
  const directiveTransformers = [
    authDirectiveGraphqlTransformer,
  ]
  schema = directiveTransformers.reduce((curSchema, transformer) => transformer(curSchema), schema);

  // set up Apollo Server
  const apolloServer = new ApolloServer({
    schema,
    formatError: formatErrorFn,
  });

  // eslint-disable-next-line @typescript-eslint/require-await
  const contextFn = async ({ req }: { req: Request }): Promise<GamesGraphqlContextT> => {
    return buildContext(req, gamesRequestAdapter);
  };

  await apolloServer.start();

  // inject the /graphql route
  router.use(
    '/graphql',
    expressMiddleware(apolloServer, {
      context: contextFn
    }),
  );

  return router;
}
