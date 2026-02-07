
import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge';
import { makeExecutableSchema } from '@graphql-tools/schema';
import type { GamesDbAdapter } from '@ig/games-engine-be-models';
import { gameConfigGraphqlTypeDefs, gameInfoGraphqlTypeDefs } from '@ig/games-engine-models';
import type { GraphQLSchema } from 'graphql';
import { GameConfigLogic } from '../../logic/game-config/GameConfigLogic';
import { createGameConfigResolvers } from './GameConfigResolvers';

export const createGameConfigSchema = (gamesDbAdapter: GamesDbAdapter): GraphQLSchema => {
  const gameConfigLogic: GameConfigLogic = new GameConfigLogic(gamesDbAdapter.getGameConfigsTableAdapter());

  // create the combined schema
  return makeExecutableSchema({
    typeDefs: mergeTypeDefs([
      gameConfigGraphqlTypeDefs,
      gameInfoGraphqlTypeDefs,
    ]),
    resolvers: mergeResolvers([
      createGameConfigResolvers(gameConfigLogic),
    ]),
  });
};
