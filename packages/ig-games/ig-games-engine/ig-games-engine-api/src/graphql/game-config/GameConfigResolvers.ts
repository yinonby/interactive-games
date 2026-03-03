
import type { GameConfigLogicAdapter } from '@ig/games-engine-be-models';
import type {
  GameConfigIdT,
  GameConfigT,
  PublicGameConfigT,
  UpdateGameConfigInputT, UpdateGameConfigResultT
} from '@ig/games-engine-models';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createGameConfigResolvers = (gameConfigLogicAdapter: GameConfigLogicAdapter): any => ({
  Query: {
    getGameConfigs: async (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      _: unknown,
    ): Promise<GameConfigT[]> => {
      return await gameConfigLogicAdapter.getGameConfigs();
    },

    getPublicGameConfigs: async (
      _: unknown,
      args: { gameConfigIds?: GameConfigIdT[] },
    ): Promise<PublicGameConfigT[]> => {
      return await gameConfigLogicAdapter.getPublicGameConfigs(args.gameConfigIds);
    },

    getMinimalPublicGameConfigs: async (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      _: unknown,
    ): Promise<PublicGameConfigT[]> => {
      return await gameConfigLogicAdapter.getPublicGameConfigs();
    },

    getPublicGameConfig: async (
      _: unknown,
      args: { gameConfigId: GameConfigIdT },
    ): Promise<PublicGameConfigT> => {
      return await gameConfigLogicAdapter.getPublicGameConfig(args.gameConfigId);
    },
  },

  Mutation: {
    updateGameConfig: async (
      _: unknown,
      args: { input: UpdateGameConfigInputT },
    ): Promise<UpdateGameConfigResultT> => {
      const { input } = args;
      return await gameConfigLogicAdapter.updateGameConfig(input);
    },
  }
});
