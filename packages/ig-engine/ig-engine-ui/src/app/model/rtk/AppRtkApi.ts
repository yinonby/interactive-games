
import type { GetAppConfigResponseT } from "@ig/engine-models";
import { createApi } from '@reduxjs/toolkit/query/react';
import { useHttpProvider } from '../../providers/useHttpProvider';
import { httpProviderBaseQuery } from './HttpProviderRtkBaseQuery';

export const appRtkApi = createApi({
  reducerPath: 'appRtkApiReducer',
  baseQuery: httpProviderBaseQuery(useHttpProvider),
  tagTypes: ['AppConfigTag', 'GamesConfigTag', 'GamesUserConfigTag', "GamesInstanceTag", "GamesInstanceChatTag"],
  endpoints: builder => ({
    getAppConfig: builder.query<GetAppConfigResponseT, void>({
      query: () => ({
        url: '/app-config',
        method: 'GET',
      }),
      providesTags: ['AppConfigTag'],
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
