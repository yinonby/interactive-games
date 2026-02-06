
import { appRtkApi } from '@ig/app-engine-ui';
import { getMinimalGameInfosQuery, type GetMinimalGameInfosResultT } from '@ig/games-engine-models';

const gamesConfigRtkApi = appRtkApi.injectEndpoints({
  endpoints: (builder) => ({
    getMinimalGameInfos: builder.query<GetMinimalGameInfosResultT, void>({
      query: () => ({
        url: '/games/graphql',
        kind: 'graphql',
        graphql: {
          document: getMinimalGameInfosQuery,
        }
      }),
      providesTags: ['GamesConfigTag'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetMinimalGameInfosQuery,
  util: gamesConfigRtkApiUtil,
  endpoints: gamesConfigRtkApiEndpoints,
  reducer: gamesConfigRtkApiReducer,
  middleware: gamesConfigRtkApiMiddleware,
} = gamesConfigRtkApi;

export type UseGetMinimalGameInfosQueryResultT = ReturnType<typeof useGetMinimalGameInfosQuery>;
