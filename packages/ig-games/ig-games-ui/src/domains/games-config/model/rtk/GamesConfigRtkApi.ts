
import { appRtkApi } from "@ig/engine-ui";
import { getMinimalGameConfigsQuery, type MinimalGameConfigT } from '@ig/games-models';

export type GetMinimalGameConfigsResultT = {
  minimalGameConfigs: MinimalGameConfigT[],
}

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
