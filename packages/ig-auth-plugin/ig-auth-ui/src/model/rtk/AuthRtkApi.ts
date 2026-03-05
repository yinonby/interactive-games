
import { appRtkApi } from '@ig/app-engine-ui';
import {
  getLoginInfoQuery,
  guestLoginMutation, type GetLoginInfoReponseT,
  type GuestLoginInputT, type GuestLoginResultT
} from '@ig/auth-models';

export const authRtkApi = appRtkApi.injectEndpoints({
  endpoints: builder => ({
    getLoginInfo: builder.query<GetLoginInfoReponseT['data'], void>({
      query: () => ({
        url: '/auth/graphql',
        kind: 'graphql',
        graphql: {
          document: getLoginInfoQuery,
        }
      }),
      providesTags: [{ type: 'AuthLoginInfoTag' }],
    }),

    guestLogin: builder.mutation<GuestLoginResultT, GuestLoginInputT>({
      query: (params: GuestLoginInputT) => ({
        url: '/auth/graphql',
        kind: 'graphql',
        graphql: {
          document: guestLoginMutation,
          variables: { input: params },
        }
      }),
      invalidatesTags: (result, error) => error === undefined ? [{ type: 'AuthLoginInfoTag'}] : [],
    }),
  }),
});

export const {
  useGetLoginInfoQuery,
  useGuestLoginMutation,
  util: authRtkUtil,
  endpoints: authRtkApiEndpoints,
  reducer: authRtkApiReducer,
  reducerPath: authRtkApiReducerPath,
  middleware: authRtkApiMiddleware,
} = authRtkApi;
