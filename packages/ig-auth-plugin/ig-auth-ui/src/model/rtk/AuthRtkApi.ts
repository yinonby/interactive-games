
import { appRtkApi } from '@ig/app-engine-ui';
import { guestLoginMutation, type GuestLoginInputT, type GuestLoginResultT } from '@ig/auth-models';

export const authRtkApi = appRtkApi.injectEndpoints({
  endpoints: builder => ({
    guestLogin: builder.mutation<GuestLoginResultT, GuestLoginInputT>({
      query: (params: GuestLoginInputT) => ({
        url: '/auth/graphql',
        kind: 'graphql',
        graphql: {
          document: guestLoginMutation,
          variables: { input: params },
        }
      }),
    }),
  }),
});

export const {
  util: authRtkUtil,
  endpoints: authRtkApiEndpoints,
  reducer: authRtkApiReducer,
  reducerPath: authRtkApiReducerPath,
  middleware: authRtkApiMiddleware,
  useGuestLoginMutation,
} = authRtkApi;
