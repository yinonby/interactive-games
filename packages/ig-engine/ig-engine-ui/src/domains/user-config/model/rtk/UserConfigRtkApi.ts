
import type { GameConfigIdT } from "@ig/engine-models";
import { appRtkApi } from "../../../../app/model/rtk/AppRtkApi";
import type {
  GetUserConfigResponseT,
  PostAcceptInviteResponseT, PostPlayGameResponseT
} from "../../../../types/ApiRequestTypes";

const userConfigRtkApi = appRtkApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserConfig: builder.query<GetUserConfigResponseT, void>({
      query: () => ({
        url: '/user-config',
        method: 'GET',
      }),
      providesTags: ['UserConfigTag'],
    }),

    addGameConfig: builder.mutation<void, string>({
      query: gameCode => ({
        url: '/user-config',
        method: 'POST',
        data: { gameCode },
      }),
      invalidatesTags: ['UserConfigTag'],
    }),

    playGame: builder.mutation<PostPlayGameResponseT, string>({
      query: (gameConfigId: GameConfigIdT) => ({
        url: '/user-config/play-game',
        method: 'POST',
        data: { gameConfigId },
      }),
      invalidatesTags: ['UserConfigTag'],
    }),

    acceptInvite: builder.mutation<PostAcceptInviteResponseT, string>({
      query: (invitationCode: string) => ({
        url: '/user-config/accept-invite',
        method: 'POST',
        data: { invitationCode },
      }),
      invalidatesTags: ['UserConfigTag'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useAddGameConfigMutation,
  useGetUserConfigQuery,
  usePlayGameMutation,
  useAcceptInviteMutation,
  util: userConfigRtkApiUtil,
  endpoints: userConfigRtkApiEndpoints,
  reducer: userConfigRtkApiReducer,
  middleware: userConfigRtkApiMiddleware,
} = userConfigRtkApi;

export type UseGetUserConfigQueryResultT = ReturnType<typeof useGetUserConfigQuery>;
export type UsePlayGameMutationResultT = ReturnType<typeof usePlayGameMutation>;
