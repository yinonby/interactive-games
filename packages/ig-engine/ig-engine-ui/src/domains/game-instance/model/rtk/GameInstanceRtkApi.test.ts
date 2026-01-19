
import type {
  GameInstanceExposedInfoT,
  GetGameInstanceChatResponseT, GetGameInstanceResponseT, PostGameInstanceChatMessageResponseT
} from "@ig/engine-models";
import { configureStore } from '@reduxjs/toolkit';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { gameUiConfigReducer, gameUiConfigReducerPath } from "../../../../app/model/reducers/GameUiConfigReducer";
import { appRtkApiReducerPath } from "../../../../app/model/rtk/AppRtkApi";
import type { GameUiConfigT } from "../../../../types/GameUiConfigTypes";
import {
  gameInstanceRtkApiEndpoints,
  gameInstanceRtkApiMiddleware, gameInstanceRtkApiReducer
} from "./GameInstanceRtkApi";

const gameInstanceExposedInfoMock1: GameInstanceExposedInfoT = {
  gameInstanceId: "giid-1",
} as GameInstanceExposedInfoT;

export const server = setupServer(
  http.get('https://api.test/games/game-instance/giid-1', () => {
    return HttpResponse.json({ gameInstanceExposedInfo: gameInstanceExposedInfoMock1 });
  }),
  http.get('https://api.test/games/game-instance/giid-2', () => {
    return HttpResponse.error();
  }),
  http.get('https://api.test/games/game-instance/giid-1/chat', () => {
    const response: GetGameInstanceChatResponseT = {
      chatMessages: [],
    };
    return HttpResponse.json(response);
  }),
  http.get('https://api.test/games/game-instance/giid-2/chat', () => {
    return HttpResponse.error();
  }),
  http.post('https://api.test/games/game-instance/giid-1/chat/message', () => {
    const response: PostGameInstanceChatMessageResponseT = {
      chatMsgId: "msg-1",
    };
    return HttpResponse.json(response);
  }),
  http.post('https://api.test/games/game-instance/giid-2/chat/message', () => {
    return HttpResponse.error();
  }),
);

const gameUiConfig: GameUiConfigT = {
  apiUrl: 'https://api.test',
  wssUrl: 'https://wss.test',
  appUrl: 'https://app.test',
  isTesting: true,
  isDevel: false,
}

export const createTestStore = () =>
  configureStore({
    reducer: {
      [appRtkApiReducerPath]: gameInstanceRtkApiReducer,
      [gameUiConfigReducerPath]: gameUiConfigReducer,
    },
    middleware: (gDM) => gDM().concat(gameInstanceRtkApiMiddleware),
    preloadedState: {
      [gameUiConfigReducerPath]: {
        gameUiConfig: gameUiConfig,
      }
    }
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
