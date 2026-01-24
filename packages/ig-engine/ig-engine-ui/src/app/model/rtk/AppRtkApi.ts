
import type { GetAppConfigResponseT } from '@ig/engine-models';
import { createApi } from '@reduxjs/toolkit/query/react';
import { createAppRtkBaseQuery } from './AppRtkBaseQuery';

export const appRtkApi = createApi({
  reducerPath: 'appRtkApiReducer',
  baseQuery: createAppRtkBaseQuery(),
  tagTypes: [
    'AppConfigContextTag',
    'GamesConfigTag', 'GamesUserConfigTag', 'GameTag', 'GamesInstanceTag', 'GamesInstanceChatTag'
  ],
  endpoints: builder => ({
    getAppConfig: builder.query<GetAppConfigResponseT, void>({
      query: () => ({
        url: '/app-config',
        method: 'GET',
      }),
      providesTags: ['AppConfigContextTag'],
    }),
  }),
});

export const {
  reducerPath: appRtkApiReducerPath,
  reducer: appRtkApiReducer,
  middleware: appRtkApiMiddleware,
  endpoints: appRtkApiEndpoints,
  util: appRtkUtil,
  useGetAppConfigQuery,
} = appRtkApi;
