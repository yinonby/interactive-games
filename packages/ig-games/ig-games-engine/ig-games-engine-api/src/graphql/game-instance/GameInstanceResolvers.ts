
import type { GameInstanceLogicAdapter } from '@ig/games-engine-be-models';
import type {
  AddPlayerInputT,
  AddPlayerResultT,
  GameConfigIdT,
  GameInstanceIdT,
  GameInstanceT,
  StartPlayingInputT,
  StartPlayingResultT,
  SubmitGuessInputT,
  SubmitGuessResultT,
} from '@ig/games-engine-models';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createGameInstanceResolvers = (gameConfigLogicAdapter: GameInstanceLogicAdapter): any => ({
  Query: {
    getGameConfigInstanceIds: async (gameConfigId: GameConfigIdT): Promise<GameInstanceIdT[]> => {
      return await gameConfigLogicAdapter.getGameConfigInstanceIds(gameConfigId);
    },

    getPublicGameInstance: async (gameInstanceId: GameInstanceIdT): Promise<GameInstanceT | null> => {
      return await gameConfigLogicAdapter.getPublicGameInstance(gameInstanceId);
    },
  },

  Mutation: {
    addPlayer: async (
      _: unknown,
      args: { input: AddPlayerInputT },
    ): Promise<AddPlayerResultT> => {
      const { input } = args;

      await gameConfigLogicAdapter.addPlayer(input);

      return {
        status: 'ok',
      }
    },

    startPlaying: async (
      _: unknown,
      args: { input: StartPlayingInputT },
    ): Promise<StartPlayingResultT> => {
      const { input } = args;

      await gameConfigLogicAdapter.startPlaying(input);

      return {
        status: 'ok',
      }
    },

    submitGuess: async (
      _: unknown,
      args: { input: SubmitGuessInputT },
    ): Promise<SubmitGuessResultT> => {
      const { input } = args;

      const isGuessCorrect = await gameConfigLogicAdapter.submitGuess(input);

      return {
        isGuessCorrect
      }
    },
  }
});
