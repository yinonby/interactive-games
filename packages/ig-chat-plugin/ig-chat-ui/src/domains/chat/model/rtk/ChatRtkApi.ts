
import { appRtkApi } from '@ig/app-engine-ui';
import {
  createChatMessageMutation,
  getMostRecentChatMessagesQuery,
  type CreateChatMessageInputT,
  type CreateChatMessageResponseT,
  type GetMostRecentChatMessagesParamsT,
  type GetMostRecentChatMessagesResponseT
} from '@ig/chat-models';

const chatRtkApi = appRtkApi.injectEndpoints({
  endpoints: (builder) => ({
    getChat: builder.query<GetMostRecentChatMessagesResponseT['data'], GetMostRecentChatMessagesParamsT>({
      query: (params: GetMostRecentChatMessagesParamsT) => ({
        url: '/chat/graphql',
        kind: 'graphql',
        graphql: {
          document: getMostRecentChatMessagesQuery,
          variables: params,
        }
      }),
      providesTags: (result, error, params) => [{ type: 'ChatTag', id: params.conversationId }],
    }),

    postChatMessage: builder.mutation<CreateChatMessageResponseT['data'], CreateChatMessageInputT>({
      query: (params: CreateChatMessageInputT) => ({
        url: '/chat/graphql',
        kind: 'graphql',
        graphql: {
          document: createChatMessageMutation,
          variables: { input: params },
        }
      }),
      invalidatesTags: (result, error, params) =>
        error === undefined ? [{ type: 'ChatTag', id: params.conversationId }] : [],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetChatQuery,
  usePostChatMessageMutation,
  util: chatRtkApiUtil,
  endpoints: chatRtkApiEndpoints,
  reducer: chatRtkApiReducer,
  middleware: chatRtkApiMiddleware,
} = chatRtkApi;

export type UseGetChatQueryResultT = ReturnType<typeof useGetChatQuery>;
