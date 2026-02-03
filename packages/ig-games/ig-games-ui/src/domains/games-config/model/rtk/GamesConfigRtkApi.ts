
import { appRtkApi } from "@ig/engine-ui";
import { getMinimalGameConfigsQuery, type GetMinimalGameConfigsResultT } from '@ig/games-models';

const gamesConfigRtkApi = appRtkApi.injectEndpoints({
  endpoints: (builder) => ({
    getMinimalGameConfigs: builder.query<GetMinimalGameConfigsResultT, void>({
      query: () => ({
        url: '/games/graphql',
        kind: 'graphql',
        graphql: {
          document: getMinimalGameConfigsQuery,
        }
      }),
      providesTags: ['GamesConfigTag'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetMinimalGameConfigsQuery,
  util: gamesConfigRtkApiUtil,
  endpoints: gamesConfigRtkApiEndpoints,
  reducer: gamesConfigRtkApiReducer,
  middleware: gamesConfigRtkApiMiddleware,
} = gamesConfigRtkApi;

export type UseGetMinimalGameConfigsQueryResultT = ReturnType<typeof useGetMinimalGameConfigsQuery>;
