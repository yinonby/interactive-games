
import {
  appRtkApiReducerPath,
  useClientLogger, type AppRtkHttpAdapterGeneratorProvider
} from '@ig/app-engine-ui';
import type {
  CreateChatMessageResponseT,
  GetMostRecentChatMessagesResponseT
} from '@ig/chat-models';
import { Axios, type HttpAdapter } from '@ig/client-utils';
import { configureStore } from '@reduxjs/toolkit';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { MAX_INITIAL_CHAT_MESSAGES } from './ChatModel';
import {
  chatRtkApiEndpoints,
  chatRtkApiMiddleware, chatRtkApiReducer
} from './ChatRtkApi';

const apiUrl = 'https://api.test';

export const appRtkHttpAdapterGeneratorProviderMock: AppRtkHttpAdapterGeneratorProvider = {
  generateHttpAdapter: (): HttpAdapter | null => {
    return new Axios(apiUrl);
  }
}

const conversationId1 = 'CID1';
const conversationId2 = 'CID2';
const conversationId3 = 'CID3';

let currentRequest: 'getChat1' | 'getChat2' | 'getChatErr' | 'createChatMessage1' | 'createChatMessage2' = 'getChat1';

export const server = setupServer(
  http.post(apiUrl + '/chat/graphql', () => {
    if (currentRequest === 'getChat1') {
      const response: GetMostRecentChatMessagesResponseT = {
        data: {
          mostRecentChatMessages: [],
        },
      };
      return HttpResponse.json(response);
    } else if (currentRequest === 'getChat2') {
      return HttpResponse.json({
        errors: [{ message: 'ERROR' }],
      });
    } else if (currentRequest === 'getChatErr') {
      return HttpResponse.error();
    } else if (currentRequest === 'createChatMessage1') {
      const response: CreateChatMessageResponseT = {
        data: {
          createChatMessageResult: {
            msgId: 'msg-1',
          },
        },
      };
      return HttpResponse.json(response);
    } else if (currentRequest === 'createChatMessage2') {
      return HttpResponse.json({
        errors: [{ message: 'ERROR' }],
      });
    }
  }),
);

export const createTestStore = () =>
  // gameUiConfigReducer is needed inside appRtkApiReducer to get gameUiConfig
  configureStore({
    reducer: {
      [appRtkApiReducerPath]: chatRtkApiReducer,
    },
    middleware: (gDM) => gDM({
      thunk: {
        extraArgument: {
          appRtkHttpAdapterGeneratorProvider: appRtkHttpAdapterGeneratorProviderMock,
          logger: useClientLogger(),
        },
      },
    }).concat(chatRtkApiMiddleware),
  });

describe('ChatRtkApi', () => {
  beforeAll(() => {
    server.listen();
  });

  afterEach(() => {
    server.resetHandlers();
  });

  afterAll(() => server.close());

  describe('getChat', () => {
    it('fetches chat', async () => {
      const store = createTestStore();

      currentRequest = 'getChat1';
      const rtkResult = await store.dispatch(
        chatRtkApiEndpoints.getChat.initiate({ conversationId: conversationId1, limit: MAX_INITIAL_CHAT_MESSAGES })
      );
      if (rtkResult.data === undefined) {
        throw new Error('rtkResult.data is undefined');
      }

      expect(rtkResult.data.mostRecentChatMessages).toEqual([]);
    });

    it('does not fetch chat when conversation id is invalid', async () => {
      const store = createTestStore();

      currentRequest = 'getChat2';
      const rtkResult = await store.dispatch(
        chatRtkApiEndpoints.getChat.initiate({ conversationId: conversationId2, limit: MAX_INITIAL_CHAT_MESSAGES })
      );

      expect(rtkResult.isError).toBeTruthy();
      expect(rtkResult.data).toBeUndefined();
    });

    it('handles network error', async () => {
      const store = createTestStore();

      currentRequest = 'getChatErr';
      const rtkResult = await store.dispatch(
        chatRtkApiEndpoints.getChat.initiate({ conversationId: conversationId3, limit: MAX_INITIAL_CHAT_MESSAGES })
      );

      expect(rtkResult.isError).toBeTruthy();
      expect(rtkResult.data).toBeUndefined();
    });
  });

  describe('postChatMessage', () => {
    it('posts chat message', async () => {
      const store = createTestStore();

      currentRequest = 'createChatMessage1';
      const rtkResult = await store.dispatch(
        chatRtkApiEndpoints.postChatMessage.initiate({
          conversationId: conversationId1,
          conversationKind: 'gameChat',
          senderId: 'user-1',
          senderDisplayName: 'name-1',
          sentTs: 100,
          msgContent: 'Hello',
        })
      );
      if (rtkResult.data === undefined) {
        throw new Error('rtkResult.data is undefined');
      }

      expect(rtkResult.data.createChatMessageResult.msgId).toEqual('msg-1');
    });

    it('does not post chat message when conversation id is invalid', async () => {
      const store = createTestStore();

      currentRequest = 'createChatMessage2';
      const rtkResult = await store.dispatch(
        chatRtkApiEndpoints.postChatMessage.initiate({
          conversationId: conversationId1,
          conversationKind: 'gameChat',
          senderId: 'user-1',
          senderDisplayName: 'name-1',
          sentTs: 100,
          msgContent: 'Hello',
        })
      );

      expect(rtkResult.error).toBeTruthy();
      expect(rtkResult.data).toBeUndefined();
    });
  });
});
