
import type { GetAppConfigResponseT } from "@ig/engine-models";
import { configureStore } from '@reduxjs/toolkit';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import type { GameUiConfigT } from "../../../types/GameUiConfigTypes";
import { gameUiConfigReducer, gameUiConfigReducerPath } from "../../model/reducers/GameUiConfigReducer";
import { appRtkApiReducer, appRtkApiReducerPath } from "../../model/rtk/AppRtkApi";
import { appRtkApiEndpoints, appRtkApiMiddleware } from "./AppRtkApi";

const appConfigMock = { availableMinimalGameConfigs: [] };

export const server = setupServer(
  http.get('https://api.test/app-config', () => {
    return HttpResponse.json(appConfigMock);
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
      [appRtkApiReducerPath]: appRtkApiReducer,
      [gameUiConfigReducerPath]: gameUiConfigReducer,
    },
    middleware: (gDM) => gDM().concat(appRtkApiMiddleware),
    preloadedState: {
      [gameUiConfigReducerPath]: {
        gameUiConfig: gameUiConfig,
      }
    }
  });

describe('AppRtkApi', () => {
  beforeAll(() => {
    server.listen();
  });
  afterEach(() => {
    server.resetHandlers();
  });
  afterAll(() => server.close());

  it('fetches app config', async () => {
    const store = createTestStore();

    const result = await store.dispatch(
      appRtkApiEndpoints.getAppConfig.initiate()
    );
    const response: GetAppConfigResponseT | undefined = result.data;

    if (response === undefined) {
      throw new Error('result.data is undefined');
    }
    expect(response.availableMinimalGameConfigs).toEqual(appConfigMock.availableMinimalGameConfigs);
  });
});
