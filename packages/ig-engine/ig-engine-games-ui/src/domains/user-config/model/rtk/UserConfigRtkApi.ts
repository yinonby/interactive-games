
import { appRtkApi } from "@ig/engine-app-ui";
import type {
  GameConfigIdT, GetUserConfigResponseT,
  PostAcceptInviteResponseT, PostPlayGameResponseT
} from "@ig/engine-models";

const userConfigRtkApi = appRtkApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserConfig: builder.query<GetUserConfigResponseT, void>({
      query: () => ({
        url: '/games/user-config',
        method: 'GET',
      }),
      providesTags: ['GamesUserConfigTag'],
    }),

    addGameConfig: builder.mutation<void, string>({
      query: gameCode => ({
        url: '/games/user-config',
        method: 'POST',
        data: { gameCode },
      }),
      invalidatesTags: ['GamesUserConfigTag'],
    }),

    playGame: builder.mutation<PostPlayGameResponseT, string>({
      query: (gameConfigId: GameConfigIdT) => ({
        url: '/games/user-config/play-game',
        method: 'POST',
        data: { gameConfigId },
      }),
      invalidatesTags: ['GamesUserConfigTag'],
    }),

    acceptInvite: builder.mutation<PostAcceptInviteResponseT, string>({
      query: (invitationCode: string) => ({
        url: '/games/user-config/accept-invite',
        method: 'POST',
        data: { invitationCode },
      }),
      invalidatesTags: ['GamesUserConfigTag'],
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
