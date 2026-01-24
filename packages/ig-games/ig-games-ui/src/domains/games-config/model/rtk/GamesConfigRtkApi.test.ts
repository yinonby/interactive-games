
import { Axios, type HttpAdapter } from '@ig/client-utils';
import { appRtkApiMiddleware, appRtkApiReducer, appRtkApiReducerPath, useClientLogger, type AppRtkHttpAdapterGeneratorProvider } from "@ig/engine-ui";
import type { GetGamesConfigResponseT } from '@ig/games-models';
import { configureStore } from '@reduxjs/toolkit';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { gamesConfigRtkApiEndpoints } from "./GamesConfigRtkApi";

const apiUrl = 'https://api.test';

export const appRtkHttpAdapterGeneratorProviderMock: AppRtkHttpAdapterGeneratorProvider = {
  generateHttpAdapter: (): HttpAdapter | null => {
    return new Axios(apiUrl);
  }
}

const gamesConfigResponse: GetGamesConfigResponseT = {
  gamesConfig: {
    availableMinimalGameConfigs: []
  }
};

export const server = setupServer(
  http.get(apiUrl + '/games/games-config', () => {
    return HttpResponse.json(gamesConfigResponse);
  }),
);

export const createTestStore = () =>
  configureStore({
    reducer: {
      [appRtkApiReducerPath]: appRtkApiReducer,
    },
    middleware: (gDM) => gDM({
      thunk: {
        extraArgument: {
          appRtkHttpAdapterGeneratorProvider: appRtkHttpAdapterGeneratorProviderMock,
          logger: useClientLogger(),
        },
      },
    }).concat(appRtkApiMiddleware),
  });

describe('GamesConfigRtkApi', () => {
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
      gamesConfigRtkApiEndpoints.getGamesConfig.initiate()
    );
    const response: GetGamesConfigResponseT | undefined = result.data;

    if (response === undefined) {
      throw new Error('result.data is undefined');
    }
    expect(response).toEqual(gamesConfigResponse);
  });
});
