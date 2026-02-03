
import { guestLoginMutation, type GuestLoginResultT } from '@ig/auth-models';
import { appRtkApi } from "@ig/engine-ui";

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
