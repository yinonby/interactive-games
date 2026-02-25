
import { appRtkApi } from '@ig/app-engine-ui';
import type {
  GameInstanceIdT,
  GetGameInstanceResponseT,
  PostGameInstanceStartResponseT,
  PostGameInstanceSubmitGuessParamsT,
  PostGameInstanceSubmitGuessResponseT
} from '@ig/games-engine-models';

const gameInstanceRtkApi = appRtkApi.injectEndpoints({
  endpoints: (builder) => ({
    getGameInstance: builder.query<GetGameInstanceResponseT, GameInstanceIdT>({
      query: (gameInstanceId: GameInstanceIdT) => ({
        url: `/games/game-instance/${gameInstanceId}`,
        method: 'GET',
      }),
      providesTags: (result, error, gameInstanceId) => [{ type: 'GamesInstanceTag', id: gameInstanceId }],
    }),

    startGame: builder.mutation<PostGameInstanceStartResponseT, GameInstanceIdT>({
      query: (gameInstanceId: GameInstanceIdT) => ({
        url: `/games/game-instance/${gameInstanceId}/start`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, gameInstanceId) => [{ type: 'GamesInstanceTag', id: gameInstanceId }],
    }),

    submitGuess: builder.mutation<PostGameInstanceSubmitGuessResponseT, PostGameInstanceSubmitGuessParamsT>({
      query: (params: PostGameInstanceSubmitGuessParamsT) => ({
        url: `/games/game-instance/${params.gameInstanceId}/submit-guess`,
        method: 'POST',
        data: { levelIdx: params.levelIdx, guess: params.guess },
      }),
      invalidatesTags: (result, error, params) => [{ type: 'GamesInstanceTag', id: params.gameInstanceId }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetGameInstanceQuery,
  useStartGameMutation,
  useSubmitGuessMutation,
  util: gameInstanceRtkApiUtil,
  endpoints: gameInstanceRtkApiEndpoints,
  reducer: gameInstanceRtkApiReducer,
  middleware: gameInstanceRtkApiMiddleware,
} = gameInstanceRtkApi;

export type UseGetGameInstanceQueryResultT = ReturnType<typeof useGetGameInstanceQuery>;
export type UseStartGameMutationResultT = ReturnType<typeof useStartGameMutation>;
