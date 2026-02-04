
import { appRtkApi } from '@ig/app-engine-ui';
import { guestLoginMutation, type GuestLoginResultT } from '@ig/auth-models';

export const authRtkApi = appRtkApi.injectEndpoints({
  endpoints: builder => ({
    guestLogin: builder.mutation<GuestLoginResultT, void>({
      query: () => ({
        url: '/auth/graphql',
        kind: 'graphql',
        graphql: {
          document: guestLoginMutation,
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
