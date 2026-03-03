
import { appRtkApi } from '@ig/app-engine-ui';
import {
  addGameConfigIdInputMutation,
  getPublicGameUserQuery,
  type AddGameConfigIdInputT,
  type AddGameConfigIdResponseT,
  type GetPublicGameUserResponseT
} from '@ig/games-engine-models';

const gameUserRtkApi = appRtkApi.injectEndpoints({
  endpoints: (builder) => ({
    getPublicGameUser: builder.query<GetPublicGameUserResponseT['data'], void>({
      query: () => ({
        url: '/games/graphql',
        kind: 'graphql',
        graphql: {
          document: getPublicGameUserQuery,
          variables: { },
        }
      }),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      providesTags: (result, error, gameUserId) =>
        result !== undefined ? [{ type: 'GameUserTag', id: result.publicGameUser.gameUserId }] : [],
    }),

    addGameConfigId: builder.mutation<AddGameConfigIdResponseT['data'], AddGameConfigIdInputT>({
      query: (params: AddGameConfigIdInputT) => ({
        url: '/games/graphql',
        kind: 'graphql',
        graphql: {
          document: addGameConfigIdInputMutation,
          variables: { input: params },
        }
      }),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      invalidatesTags: (result, error, params) =>
        result !== undefined ? [{ type: 'GameUserTag', id: result.addGameConfigIdResult.gameUserId }] : [],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetPublicGameUserQuery,
  useAddGameConfigIdMutation,
  util: gameUserRtkApiUtil,
  endpoints: gameUserRtkApiEndpoints,
  reducer: gameUserRtkApiReducer,
  middleware: gameUserRtkApiMiddleware,
} = gameUserRtkApi;

export type UseGetPublicGameUserQueryResultT = ReturnType<typeof useGetPublicGameUserQuery>;
export type UseAddGameConfigIdMutationMutationResultT = ReturnType<typeof useAddGameConfigIdMutation>;
