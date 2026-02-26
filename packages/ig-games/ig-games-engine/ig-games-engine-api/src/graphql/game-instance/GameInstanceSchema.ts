
import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge';
import { makeExecutableSchema } from '@graphql-tools/schema';
import type { GamesDbAdapter } from '@ig/games-engine-be-models';
import { gameInstanceGraphqlTypeDefs } from '@ig/games-engine-models';
import type { GraphQLSchema } from 'graphql';
import { GameInstanceLogic } from '../../logic/game-instance/GameInstanceLogic';
import { createGameInstanceResolvers } from './GameInstanceResolvers';

export const createGameInstanceSchema = (gamesDbAdapter: GamesDbAdapter): GraphQLSchema => {
  const gameInstanceLogic: GameInstanceLogic = new GameInstanceLogic(gamesDbAdapter.getGameInstancesTableAdapter());

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
