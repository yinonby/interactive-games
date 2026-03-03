
import type { GameInstanceLogicAdapter } from '@ig/games-engine-be-models';
import type {
  CreateGameInstanceInputT,
  CreateGameInstanceResultT,
  GameConfigIdT,
  GameInstanceIdT,
  GameInstanceT,
  JoinGameByInviteInputT,
  JoinGameByInviteResultT,
  StartPlayingInputT,
  StartPlayingResultT,
  SubmitGuessInputT,
  SubmitGuessResultT,
} from '@ig/games-engine-models';
import type { GamesGraphqlContextT } from '../../types/GamesPluginTypes';

type QueryResolvers = {
  getGameInstanceIdsForGameConfig: (
    _: unknown,
    args: { gameConfigId: GameConfigIdT },
    context: GamesGraphqlContextT
  ) => Promise<GameInstanceIdT[]>,

  getPublicGameInstance: (
    _: unknown,
    args: { gameInstanceId: GameInstanceIdT },
    context: GamesGraphqlContextT,
  ) => Promise<GameInstanceT | null>,
};

type MutationResolvers = {
  createGameInstance: (
    _: unknown,
    args: { input: CreateGameInstanceInputT },
    context: GamesGraphqlContextT,
  ) => Promise<CreateGameInstanceResultT>,

  joinGameByInvite: (
    _: unknown,
    args: { input: JoinGameByInviteInputT },
    context: GamesGraphqlContextT,
  ) => Promise<JoinGameByInviteResultT>,

  startPlaying: (
    _: unknown,
    args: { input: StartPlayingInputT },
    context: GamesGraphqlContextT,
  ) => Promise<StartPlayingResultT>,

  submitGuess: (
    _: unknown,
    args: { input: SubmitGuessInputT },
    context: GamesGraphqlContextT,
  ) => Promise<SubmitGuessResultT>,
};

type GameInstanceResolvers = {
  Query: QueryResolvers,
  Mutation: MutationResolvers,
};

export const createGameInstanceResolvers = (
  gameConfigLogicAdapter: GameInstanceLogicAdapter,
): GameInstanceResolvers => ({
  Query: {
    getGameInstanceIdsForGameConfig: async (
      _: unknown,
      args: { gameConfigId: GameConfigIdT },
      context: GamesGraphqlContextT,
    ): Promise<GameInstanceIdT[]> => {
      return await gameConfigLogicAdapter.getGameInstanceIdsForGameConfig(context.gameUserId, args);
    },

    getPublicGameInstance: async (
      _: unknown,
      args: { gameInstanceId: GameInstanceIdT },
      context: GamesGraphqlContextT,
    ): Promise<GameInstanceT | null> => {
      return await gameConfigLogicAdapter.getPublicGameInstance(context.gameUserId, args);
    },
  },

  Mutation: {
    createGameInstance: async (
      _: unknown,
      args: { input: CreateGameInstanceInputT },
      context: GamesGraphqlContextT,
    ): Promise<CreateGameInstanceResultT> => {
      const gameInstanceId = await gameConfigLogicAdapter.createGameInstance(context.gameUserId, args.input);

      return {
        gameInstanceId,
      }
    },

    joinGameByInvite: async (
      _: unknown,
      args: { input: JoinGameByInviteInputT },
      context: GamesGraphqlContextT,
    ): Promise<JoinGameByInviteResultT> => {
      const gameInstanceId = await gameConfigLogicAdapter.joinGameByInvite(context.gameUserId, args.input);

      return {
        gameInstanceId,
      }
    },

    startPlaying: async (
      _: unknown,
      args: { input: StartPlayingInputT },
      context: GamesGraphqlContextT,
    ): Promise<StartPlayingResultT> => {
      await gameConfigLogicAdapter.startPlaying(context.gameUserId, args.input);

      return {
        status: 'ok',
      }
    },

    submitGuess: async (
      _: unknown,
      args: { input: SubmitGuessInputT },
      context: GamesGraphqlContextT,
    ): Promise<SubmitGuessResultT> => {
      const isGuessCorrect = await gameConfigLogicAdapter.submitGuess(context.gameUserId, args.input);

      return {
        isGuessCorrect
      }
    },
  }
});
