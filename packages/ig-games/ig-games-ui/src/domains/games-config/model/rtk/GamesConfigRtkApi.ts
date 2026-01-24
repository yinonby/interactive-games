
import { appRtkApi } from "@ig/engine-ui";
import type { GetGamesConfigResponseT } from '@ig/games-models';

const gamesConfigRtkApi = appRtkApi.injectEndpoints({
  endpoints: (builder) => ({
    getGamesConfig: builder.query<GetGamesConfigResponseT, void>({
      query: () => ({
        url: '/games/games-config',
        method: 'GET',
      }),
      providesTags: ['GamesConfigTag'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetGamesConfigQuery,
  util: gamesConfigRtkApiUtil,
  endpoints: gamesConfigRtkApiEndpoints,
  reducer: gamesConfigRtkApiReducer,
  middleware: gamesConfigRtkApiMiddleware,
} = gamesConfigRtkApi;

export type UseGetGameConfigQueryResultT = ReturnType<typeof useGetGamesConfigQuery>;
