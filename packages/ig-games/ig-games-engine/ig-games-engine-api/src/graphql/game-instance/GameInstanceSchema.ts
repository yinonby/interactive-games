
import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge';
import { makeExecutableSchema } from '@graphql-tools/schema';
import type { GameInstanceLogicAdapter, GamesDbAdapter, GamesUserAdapter } from '@ig/games-engine-be-models';
import { gameInstanceGraphqlTypeDefs } from '@ig/games-engine-models';
import type { WordleAdapter } from '@ig/games-wordle-be-models';
import type { GraphQLSchema } from 'graphql';
import { GameInstanceLogic } from '../../logic/game-instance/GameInstanceLogic';
import { createGameInstanceResolvers } from './GameInstanceResolvers';

export const createGameInstanceSchema = (
  gamesDbAdapter: GamesDbAdapter,
  gamesUserAdapter: GamesUserAdapter,
  wordleAdapter: WordleAdapter,
): GraphQLSchema => {
  const gameInstanceLogic: GameInstanceLogicAdapter = new GameInstanceLogic(
    gamesDbAdapter.getGameInstancesTableAdapter(),
    gamesDbAdapter.getGameConfigsTableAdapter(),
    gamesUserAdapter,
    wordleAdapter,
  );

  // create the combined schema
  return makeExecutableSchema({
    typeDefs: mergeTypeDefs([
      gameInstanceGraphqlTypeDefs,
    ]),
    resolvers: mergeResolvers([
      createGameInstanceResolvers(gameInstanceLogic),
    ]),
  });
};
