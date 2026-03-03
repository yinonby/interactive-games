
import { appRtkApi } from '@ig/app-engine-ui';
import { getMinimalPublicGameConfigsQuery, type GetMinimalPublicGameConfigsResultT } from '@ig/games-engine-models';

const gamesConfigRtkApi = appRtkApi.injectEndpoints({
  endpoints: (builder) => ({
    getMinimalPublicGameConfigs: builder.query<GetMinimalPublicGameConfigsResultT, void>({
      query: () => ({
        url: '/games/graphql',
        kind: 'graphql',
        graphql: {
          document: getMinimalPublicGameConfigsQuery,
        }
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetMinimalPublicGameConfigsQuery,
  util: gamesConfigRtkApiUtil,
  endpoints: gamesConfigRtkApiEndpoints,
  reducer: gamesConfigRtkApiReducer,
  middleware: gamesConfigRtkApiMiddleware,
} = gamesConfigRtkApi;

export type UseGetMinimalPublicGameConfigsQueryResultT = ReturnType<typeof useGetMinimalPublicGameConfigsQuery>;
