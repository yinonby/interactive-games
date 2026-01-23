
import { appRtkApi } from "@ig/engine-app-ui";
import type {
  GameConfigIdT, GetGamesUserConfigResponseT,
  PostAcceptInviteResponseT, PostAddGameInstanceResponseT, PostPlayGameResponseT
} from "@ig/engine-models";

const gamesUserConfigRtkApi = appRtkApi.injectEndpoints({
  endpoints: (builder) => ({
    getGamesUserConfig: builder.query<GetGamesUserConfigResponseT, void>({
      query: () => ({
        url: '/games/user-config',
        method: 'GET',
      }),
      providesTags: ['GamesUserConfigTag'],
    }),

    gamesPlayGame: builder.mutation<PostPlayGameResponseT, string>({
      query: (gameConfigId: GameConfigIdT) => ({
        url: '/games/user-config/play-game',
        method: 'POST',
        data: { gameConfigId },
      }),
      invalidatesTags: ['GamesUserConfigTag'],
    }),

    gamesAcceptInvite: builder.mutation<PostAcceptInviteResponseT, string>({
      query: (invitationCode: string) => ({
        url: '/games/user-config/accept-invite',
        method: 'POST',
        data: { invitationCode },
      }),
      invalidatesTags: ['GamesUserConfigTag'],
    }),

    addGameInstance: builder.mutation<PostAddGameInstanceResponseT, string>({
      query: (gameConfigId: GameConfigIdT) => ({
        url: '/games/user-config/add-game-instance',
        method: 'POST',
        data: { gameConfigId },
      }),
      invalidatesTags: ['GamesUserConfigTag'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetGamesUserConfigQuery,
  useGamesPlayGameMutation,
  useGamesAcceptInviteMutation,
  useAddGameInstanceMutation,
  util: gamesUserConfigRtkApiUtil,
  endpoints: gamesUserConfigRtkApiEndpoints,
  reducer: gamesUserConfigRtkApiReducer,
  middleware: gamesUserConfigRtkApiMiddleware,
} = gamesUserConfigRtkApi;

export type UseGetGamesUserConfigQueryResultT = ReturnType<typeof useGetGamesUserConfigQuery>;
export type UseGamesPlayGameMutationResultT = ReturnType<typeof useGamesPlayGameMutation>;
export type UseAddGameInstanceMutationResultT = ReturnType<typeof useAddGameInstanceMutation>;
