
import { Axios, type HttpAdapter } from '@ig/client-utils';
import type { GetAppConfigResponseT } from '@ig/engine-models';
import { configureStore } from '@reduxjs/toolkit';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import type { AppRtkHttpAdapterGeneratorProvider } from '../../../types/AppRtkTypes';
import { useClientLogger } from '../../providers/useClientLogger';
import { appRtkApiEndpoints, appRtkApiMiddleware, appRtkApiReducer, appRtkApiReducerPath } from "./AppRtkApi";

const apiUrl = 'https://api.test';

export const appRtkHttpAdapterGeneratorProviderMock: AppRtkHttpAdapterGeneratorProvider = {
  generateHttpAdapter: (): HttpAdapter | null => {
    return new Axios(apiUrl);
  }
}

const appConfigResponse: GetAppConfigResponseT = { appConfig: { version: '1.0.0' }} as GetAppConfigResponseT;

export const server = setupServer(
  http.get(apiUrl + '/app-config', () => {
    return HttpResponse.json(appConfigResponse);
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
    expect(response).toEqual(appConfigResponse);
  });
});
