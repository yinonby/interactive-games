
import { Axios, type HttpAdapter } from '@ig/client-utils';
import {
  appRtkApiReducerPath,
  useClientLogger, type AppRtkHttpAdapterGeneratorProvider
} from "@ig/engine-app-ui";
import type {
  GameInstanceExposedInfoT,
  GetGameInstanceChatResponseT, GetGameInstanceResponseT, PostGameInstanceChatMessageResponseT
} from "@ig/engine-models";
import { configureStore } from '@reduxjs/toolkit';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import {
  gameInstanceRtkApiEndpoints,
  gameInstanceRtkApiMiddleware, gameInstanceRtkApiReducer
} from "./GameInstanceRtkApi";

const apiUrl = 'https://api.test';

export const appRtkHttpAdapterGeneratorProviderMock: AppRtkHttpAdapterGeneratorProvider = {
  generateHttpAdapter: (): HttpAdapter | null => {
    return new Axios(apiUrl);
  }
}

const gameInstanceExposedInfoMock1: GameInstanceExposedInfoT = {
  gameInstanceId: "giid-1",
} as GameInstanceExposedInfoT;

export const server = setupServer(
  // get chat
  http.get(apiUrl + '/games/game-instance/giid-1', () => {
    return HttpResponse.json({ gameInstanceExposedInfo: gameInstanceExposedInfoMock1 });
  }),
  http.get(apiUrl + '/games/game-instance/giid-2', () => {
    return HttpResponse.error();
  }),
  http.get(apiUrl + '/games/game-instance/giid-1/chat', () => {
    const response: GetGameInstanceChatResponseT = {
      chatMessages: [],
    };
    return HttpResponse.json(response);
  }),
  http.get(apiUrl + '/games/game-instance/giid-2/chat', () => {
    return HttpResponse.error();
  }),

  // post chat message
  http.post(apiUrl + '/games/game-instance/giid-1/chat/message', () => {
    const response: PostGameInstanceChatMessageResponseT = {
      chatMsgId: "msg-1",
    };
    return HttpResponse.json(response);
  }),
  http.post(apiUrl + '/games/game-instance/giid-2/chat/message', () => {
    return HttpResponse.error();
  }),
);

export const createTestStore = () =>
  // gameUiConfigReducer is needed inside appRtkApiReducer to get gameUiConfig
  configureStore({
    reducer: {
      [appRtkApiReducerPath]: gameInstanceRtkApiReducer,
    },
    middleware: (gDM) => gDM({
      thunk: {
        extraArgument: {
          appRtkHttpAdapterGeneratorProvider: appRtkHttpAdapterGeneratorProviderMock,
          logger: useClientLogger(),
        },
      },
    }).concat(gameInstanceRtkApiMiddleware),
  });

describe('GameInstanceRtkApi', () => {
  beforeAll(() => {
    server.listen();
  });
  afterEach(() => {
    server.resetHandlers();
  });
  afterAll(() => server.close());

  it('fetches game instance', async () => {
    const store = createTestStore();

    const result = await store.dispatch(
      gameInstanceRtkApiEndpoints.getGameInstance.initiate("giid-1")
    );
    if (result.data === undefined) {
      throw new Error('result.data is undefined');
    }

    const getGameInstanceResponse: GetGameInstanceResponseT = result.data;
    expect(getGameInstanceResponse.gameInstanceExposedInfo.gameInstanceId).toEqual("giid-1");
  });

  it('does not fetch game instance when id does not exist', async () => {
    const store = createTestStore();

    const result = await store.dispatch(
      gameInstanceRtkApiEndpoints.getGameInstance.initiate("giid-2")
    );

    expect(result.isError).toBeTruthy();
    expect(result.data).toBeUndefined();
  });

  it('fetches game instance chat', async () => {
    const store = createTestStore();

    const result = await store.dispatch(
      gameInstanceRtkApiEndpoints.getGameInstanceChat.initiate("giid-1")
    );
    if (result.data === undefined) {
      throw new Error('result.data is undefined');
    }

    const response: GetGameInstanceChatResponseT = result.data;
    expect(response.chatMessages).toEqual([]);
  });

  it('does not fetch game instance chat when id does not exist', async () => {
    const store = createTestStore();

    const result = await store.dispatch(
      gameInstanceRtkApiEndpoints.getGameInstanceChat.initiate("giid-2")
    );

    expect(result.isError).toBeTruthy();
    expect(result.data).toBeUndefined();
  });

  it('posts game instance chat message', async () => {
    const store = createTestStore();

    const result = await store.dispatch(
      gameInstanceRtkApiEndpoints.postGameInstanceChatMessage.initiate({
        gameInstanceId: "giid-1",
        playerUserId: "user-1",
        chatMessage: "Hello world",
      })
    );
    if (result.data === undefined) {
      throw new Error('result.data is undefined');
    }

    const response: PostGameInstanceChatMessageResponseT = result.data;
    expect(response.chatMsgId).toEqual("msg-1");
  });

  it('does not post game instance chat message when id does not exist', async () => {
    const store = createTestStore();

    const result = await store.dispatch(
      gameInstanceRtkApiEndpoints.postGameInstanceChatMessage.initiate({
        gameInstanceId: "giid-2",
        playerUserId: "user-1",
        chatMessage: "Hello world",
      })
    );

    expect(result.error).toBeTruthy();
    expect(result.data).toBeUndefined();
  });
});
