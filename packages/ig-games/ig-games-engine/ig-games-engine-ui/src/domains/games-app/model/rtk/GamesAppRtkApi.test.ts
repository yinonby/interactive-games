
import {
  appRtkApiMiddleware, appRtkApiReducer,
  appRtkApiReducerPath, useClientLogger, type AppRtkHttpAdapterGeneratorProvider
} from '@ig/app-engine-ui';
import { Axios, type HttpAdapter } from '@ig/client-utils';
import type { GetMinimalPublicGameConfigsResponseT, GetMinimalPublicGameConfigsResultT } from '@ig/games-engine-models';
import { configureStore } from '@reduxjs/toolkit';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { gamesConfigRtkApiEndpoints } from './GamesAppRtkApi';

const apiUrl = 'https://api.test';

export const appRtkHttpAdapterGeneratorProviderMock: AppRtkHttpAdapterGeneratorProvider = {
  generateHttpAdapter: (): HttpAdapter | null => {
    return new Axios(apiUrl);
  }
}

const getMinimalGameConfigsResponse: GetMinimalPublicGameConfigsResponseT = {
  data: {
    minimalPublicGameConfigs: [],
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
      gamesConfigRtkApiEndpoints.getMinimalPublicGameConfigs.initiate()
    );
    const response: GetMinimalPublicGameConfigsResultT | undefined = result.data;

    if (response === undefined) {
      throw new Error('result.data is undefined');
    }
    expect(response.minimalPublicGameConfigs).toEqual(getMinimalGameConfigsResponse.data.minimalPublicGameConfigs);
  });
});
