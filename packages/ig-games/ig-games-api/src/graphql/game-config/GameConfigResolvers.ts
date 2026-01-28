
import type { GameConfigLogicAdapter } from '@ig/games-be-models';
import type { GameConfigT, UpdateGameConfigInputT, UpdateGameConfigResultT } from '@ig/games-models';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createGameConfigResolvers = (gameConfigLogicAdapter: GameConfigLogicAdapter): any => ({
  Query: {
    getGameConfigs: async (): Promise<GameConfigT[]> => {
      return await gameConfigLogicAdapter.getGameConfigs();
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
