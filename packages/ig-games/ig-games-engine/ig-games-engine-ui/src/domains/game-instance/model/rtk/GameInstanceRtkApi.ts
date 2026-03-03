
import { appRtkApi } from '@ig/app-engine-ui';
import {
  createGameInstanceInputMutation,
  getGameInstanceIdsForGameConfigQuery,
  getGameInstanceQuery,
  joinGameByInviteInputMutation,
  startPlayingInputMutation,
  submitGuessInputMutation,
  type CreateGameInstanceInputT,
  type CreateGameInstanceResponseT,
  type GameConfigIdT,
  type GameInstanceIdT,
  type GetGameInstanceIdsForGameConfigResponseT,
  type GetGameInstanceResponseT,
  type JoinGameByInviteInputT,
  type JoinGameByInviteResponseT,
  type StartPlayingInputT,
  type StartPlayingResponseT,
  type SubmitGuessInputT,
  type SubmitGuessResponseT
} from '@ig/games-engine-models';

const gameInstanceRtkApi = appRtkApi.injectEndpoints({
  endpoints: (builder) => ({
    getGameInstanceIdsForGameConfig: builder.query<GetGameInstanceIdsForGameConfigResponseT['data'], GameConfigIdT>({
      query: (gameConfigId: GameConfigIdT) => ({
        url: '/games/graphql',
        kind: 'graphql',
        graphql: {
          document: getGameInstanceIdsForGameConfigQuery,
          variables: { gameConfigId },
        }
      }),
      providesTags: (result, error, gameConfigId) => [{ type: 'GameConfigInstanceIdsTag', id: gameConfigId }],
    }),

    getPublicGameInstance: builder.query<GetGameInstanceResponseT['data'], GameInstanceIdT>({
      query: (gameInstanceId: GameInstanceIdT) => ({
        url: '/games/graphql',
        kind: 'graphql',
        graphql: {
          document: getGameInstanceQuery,
          variables: { gameInstanceId },
        }
      }),
      providesTags: (result, error, gameInstanceId) => [{ type: 'GameInstanceTag', id: gameInstanceId }],
    }),

    createGameInstace: builder.mutation<CreateGameInstanceResponseT['data'], CreateGameInstanceInputT>({
      query: (params: CreateGameInstanceInputT) => ({
        url: '/games/graphql',
        kind: 'graphql',
        graphql: {
          document: createGameInstanceInputMutation,
          variables: { input: params },
        }
      }),
      invalidatesTags: (result, error, params) => error === undefined ?
        [{ type: 'GameConfigInstanceIdsTag', id: params.gameConfigId }] : [],
    }),

    joinGameByInvite: builder.mutation<JoinGameByInviteResponseT['data'], JoinGameByInviteInputT>({
      query: (params: JoinGameByInviteInputT) => ({
        url: '/games/graphql',
        kind: 'graphql',
        graphql: {
          document: joinGameByInviteInputMutation,
          variables: { input: params },
        }
      }),
    }),

    startPlaying: builder.mutation<StartPlayingResponseT['data'], StartPlayingInputT>({
      query: (params: StartPlayingInputT) => ({
        url: '/games/graphql',
        kind: 'graphql',
        graphql: {
          document: startPlayingInputMutation,
          variables: { input: params },
        }
      }),
      invalidatesTags: (result, error, params) =>
        error === undefined ? [{ type: 'GameInstanceTag', id: params.gameInstanceId }] : [],
    }),

    submitGuess: builder.mutation<SubmitGuessResponseT['data'], SubmitGuessInputT>({
      query: (params: SubmitGuessInputT) => ({
        url: '/games/graphql',
        kind: 'graphql',
        graphql: {
          document: submitGuessInputMutation,
          variables: { input: params },
        }
      }),
      invalidatesTags: (result, error, params) =>
        error === undefined ? [{ type: 'GameInstanceTag', id: params.gameInstanceId }] : [],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetGameInstanceIdsForGameConfigQuery,
  useGetPublicGameInstanceQuery,
  useCreateGameInstaceMutation,
  useJoinGameByInviteMutation,
  useStartPlayingMutation,
  useSubmitGuessMutation,
  util: gameInstanceRtkApiUtil,
  endpoints: gameInstanceRtkApiEndpoints,
  reducer: gameInstanceRtkApiReducer,
  middleware: gameInstanceRtkApiMiddleware,
} = gameInstanceRtkApi;

export type UseGetGameInstanceIdsForGameConfigQueryResultT = ReturnType<typeof useGetGameInstanceIdsForGameConfigQuery>;
export type UseGetPublicGameInstanceQueryResultT = ReturnType<typeof useGetPublicGameInstanceQuery>;
export type UseStartPlayingMutationResultT = ReturnType<typeof useStartPlayingMutation>;
