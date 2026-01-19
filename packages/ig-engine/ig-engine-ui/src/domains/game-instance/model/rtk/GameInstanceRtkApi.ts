
import type {
  GameInstanceIdT, GetGameInstanceChatResponseT,
  GetGameInstanceResponseT, PostGameInstanceChatMessageParamT, PostGameInstanceChatMessageResponseT
} from "@ig/engine-models";
import { appRtkApi } from "../../../../app/model/rtk/AppRtkApi";

const gameInstanceRtkApi = appRtkApi.injectEndpoints({
  endpoints: (builder) => ({
    getGameInstance: builder.query<GetGameInstanceResponseT, GameInstanceIdT>({
      query: (gameInstanceId: GameInstanceIdT) => ({
        url: `/games/game-instance/${gameInstanceId}`,
        method: 'GET',
      }),
      providesTags: (result, error, gameInstanceId) => [{ type: 'GamesInstanceTag', id: gameInstanceId }],
    }),

    getGameInstanceChat: builder.query<GetGameInstanceChatResponseT, GameInstanceIdT>({
      query: (gameInstanceId: GameInstanceIdT) => ({
        url: `/games/game-instance/${gameInstanceId}/chat`,
        method: 'GET',
      }),
      providesTags: (result, error, gameInstanceId) => [{ type: 'GamesInstanceChatTag', id: gameInstanceId }],
    }),

    postGameInstanceChatMessage: builder.mutation<PostGameInstanceChatMessageResponseT, PostGameInstanceChatMessageParamT>({
      query: (param: PostGameInstanceChatMessageParamT) => ({
        url: `/games/game-instance/${param.gameInstanceId}/chat/message`,
        method: 'POST',
        data: { chatMessage: param.chatMessage, playerUserId: param.playerUserId },
      }),
      invalidatesTags: (result, error, param) => [{ type: 'GamesInstanceChatTag', id: param.gameInstanceId }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetGameInstanceQuery,
  useGetGameInstanceChatQuery,
  usePostGameInstanceChatMessageMutation,
  util: gameInstanceRtkApiUtil,
  endpoints: gameInstanceRtkApiEndpoints,
  reducer: gameInstanceRtkApiReducer,
  middleware: gameInstanceRtkApiMiddleware,
} = gameInstanceRtkApi;

export type UseGetGameInstanceQueryResultT = ReturnType<typeof useGetGameInstanceQuery>;
export type UseGetGameInstanceChatQueryResultT = ReturnType<typeof useGetGameInstanceChatQuery>;
