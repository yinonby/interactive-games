
import { appRtkApi } from '@ig/app-engine-ui';
import {
  getPublicGameConfigQuery,
  getPublicGameConfigsQuery,
  type GameConfigIdT,
  type GetGameConfigsResponseT,
  type GetPublicGameConfigResponseT,
} from '@ig/games-engine-models';

const gameConfigRtkApi = appRtkApi.injectEndpoints({
  endpoints: (builder) => ({
    getPublicGameConfigs: builder.query<GetGameConfigsResponseT['data'], GameConfigIdT[]>({
      query: (gameConfigIds: GameConfigIdT[]) => ({
        url: '/games/graphql',
        kind: 'graphql',
        graphql: {
          document: getPublicGameConfigsQuery,
          variables: { gameConfigIds },
        }
      }),
    }),

    getPublicGameConfig: builder.query<GetPublicGameConfigResponseT['data'], GameConfigIdT>({
      query: (gameConfigId: GameConfigIdT) => ({
        url: '/games/graphql',
        kind: 'graphql',
        graphql: {
          document: getPublicGameConfigQuery,
          variables: { gameConfigId },
        }
      }),
      providesTags: (result, error, gameConfigId) => [{ type: 'GameConfigTag', id: gameConfigId }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetPublicGameConfigQuery,
  useGetPublicGameConfigsQuery,
  util: gameConfigRtkApiUtil,
  endpoints: gameConfigRtkApiEndpoints,
  reducer: gameConfigRtkApiReducer,
  middleware: gameConfigRtkApiMiddleware,
} = gameConfigRtkApi;

export type UseGetPublicGameConfigQueryResultT = ReturnType<typeof useGetPublicGameConfigQuery>;
export type UseGetPublicGameConfigsQueryResultT = ReturnType<typeof useGetPublicGameConfigsQuery>;
