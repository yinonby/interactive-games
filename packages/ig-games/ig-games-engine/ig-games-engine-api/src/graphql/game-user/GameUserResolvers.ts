
import type { GameUserLogicAdapter } from '@ig/games-engine-be-models';
import type {
  AddGameConfigIdInputT,
  AddGameConfigIdResultT,
  GameUserT
} from '@ig/games-engine-models';
import type { GamesGraphqlContextT } from '../../types/GamesPluginTypes';

type QueryResolvers = {
  getPublicGameUser: (
    _: unknown,
    args: unknown,
    context: GamesGraphqlContextT,
  ) => Promise<GameUserT | null>,
};

type MutationResolvers = {
  addGameConfigId: (
    _: unknown,
    args: { input: AddGameConfigIdInputT },
    context: GamesGraphqlContextT,
  ) => Promise<AddGameConfigIdResultT>,
};

type GameUserResolvers = {
  Query: QueryResolvers,
  Mutation: MutationResolvers,
};

export const createGameUserResolvers = (
  gameUserLogicAdapter: GameUserLogicAdapter,
): GameUserResolvers => ({
  Query: {
    getPublicGameUser: async (
      _: unknown,
      args: unknown,
      context: GamesGraphqlContextT,
    ): Promise<GameUserT | null> => {
      return await gameUserLogicAdapter.getPublicGameUser(context.gameUserId);
    },
  },

  Mutation: {
    addGameConfigId: async (
      _: unknown,
      args: { input: AddGameConfigIdInputT },
      context: GamesGraphqlContextT,
    ): Promise<AddGameConfigIdResultT> => {
      return await gameUserLogicAdapter.addGameConfigId(context.gameUserId, args.input);
    },
  }
});
