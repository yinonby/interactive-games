
import type { GameConfigLogicAdapter } from '@ig/games-engine-be-models';
import type { GameConfigT, GameInfoT, UpdateGameConfigInputT, UpdateGameConfigResultT } from '@ig/games-engine-models';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createGameConfigResolvers = (gameConfigLogicAdapter: GameConfigLogicAdapter): any => ({
  Query: {
    getGameConfigs: async (): Promise<GameConfigT[]> => {
      return await gameConfigLogicAdapter.getGameConfigs();
    },

    getGameInfos: async (): Promise<GameInfoT[]> => {
      return await gameConfigLogicAdapter.getGameInfos();
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
