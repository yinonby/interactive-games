
import { Axios, type HttpAdapter } from '@ig/client-utils';
import {
  appRtkApiMiddleware, appRtkApiReducer,
  appRtkApiReducerPath, useClientLogger, type AppRtkHttpAdapterGeneratorProvider
} from "@ig/engine-ui";
import type { GetMinimalGameConfigsResponseT, GetMinimalGameConfigsResultT } from '@ig/games-models';
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

const getMinimalGameConfigsResponse: GetMinimalGameConfigsResponseT = {
  data: {
    minimalGameConfigs: [],
  }
};

export const server = setupServer(
  http.post(apiUrl + '/games/graphql', () => {
    return HttpResponse.json(getMinimalGameConfigsResponse);
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
      gamesConfigRtkApiEndpoints.getMinimalGameConfigs.initiate()
    );
    const response: GetMinimalGameConfigsResultT | undefined = result.data;

    if (response === undefined) {
      throw new Error('result.data is undefined');
    }
    expect(response.minimalGameConfigs).toEqual(getMinimalGameConfigsResponse.data.minimalGameConfigs);
  });
});
