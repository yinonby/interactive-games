
import { appRtkApi } from '@ig/app-engine-ui';
import type {
    GameInstanceIdT, GetGameInstanceChatResponseT,
    GetGameInstanceResponseT, PostGameInstanceChatMessageParamsT, PostGameInstanceChatMessageResponseT,
    PostGameInstanceStartResponseT
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

    getGameInstanceChat: builder.query<GetGameInstanceChatResponseT, GameInstanceIdT>({
      query: (gameInstanceId: GameInstanceIdT) => ({
        url: `/games/game-instance/${gameInstanceId}/chat`,
        method: 'GET',
      }),
      providesTags: (result, error, gameInstanceId) => [{ type: 'GamesInstanceChatTag', id: gameInstanceId }],
    }),

    postGameInstanceChatMessage: builder.mutation<PostGameInstanceChatMessageResponseT, PostGameInstanceChatMessageParamsT>({
      query: (params: PostGameInstanceChatMessageParamsT) => ({
        url: `/games/game-instance/${params.gameInstanceId}/chat/message`,
        method: 'POST',
        data: { chatMessage: params.chatMessage, playerUserId: params.playerUserId },
      }),
      invalidatesTags: (result, error, params) => [{ type: 'GamesInstanceChatTag', id: params.gameInstanceId }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetGameInstanceQuery,
  useStartGameMutation,
  useGetGameInstanceChatQuery,
  usePostGameInstanceChatMessageMutation,
  util: gameInstanceRtkApiUtil,
  endpoints: gameInstanceRtkApiEndpoints,
  reducer: gameInstanceRtkApiReducer,
  middleware: gameInstanceRtkApiMiddleware,
} = gameInstanceRtkApi;

export type UseGetGameInstanceQueryResultT = ReturnType<typeof useGetGameInstanceQuery>;
export type UseStartGameMutationResultT = ReturnType<typeof useStartGameMutation>;
export type UseGetGameInstanceChatQueryResultT = ReturnType<typeof useGetGameInstanceChatQuery>;
