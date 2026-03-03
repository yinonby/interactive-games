
import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge';
import { makeExecutableSchema } from '@graphql-tools/schema';
import type { GameUserLogicAdapter, GamesDbAdapter } from '@ig/games-engine-be-models';
import { gameUserGraphqlTypeDefs } from '@ig/games-engine-models';
import type { GraphQLSchema } from 'graphql';
import { GameUserLogic } from '../../logic/game-user/GameUserLogic';
import { createGameUserResolvers } from './GameUserResolvers';

export const createGameUserSchema = (
  gamesDbAdapter: GamesDbAdapter,
): GraphQLSchema => {
  const gameUserLogic: GameUserLogicAdapter = new GameUserLogic(
    gamesDbAdapter.getGameUserTableAdapter(),
  );

  // create the combined schema
  return makeExecutableSchema({
    typeDefs: mergeTypeDefs([
      gameUserGraphqlTypeDefs,
    ]),
    resolvers: mergeResolvers([
      createGameUserResolvers(gameUserLogic),
    ]),
  });
};
