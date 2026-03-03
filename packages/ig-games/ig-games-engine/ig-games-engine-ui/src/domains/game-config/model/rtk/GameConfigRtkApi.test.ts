
import {
  appRtkApiReducerPath,
  useClientLogger, type AppRtkHttpAdapterGeneratorProvider
} from '@ig/app-engine-ui';
import { Axios, type HttpAdapter } from '@ig/client-utils';
import type {
  GetGameConfigsResponseT,
  GetPublicGameConfigResponseT
} from '@ig/games-engine-models';
import { buildPublicGameConfigMock } from '@ig/games-engine-models/test-utils';
import { configureStore } from '@reduxjs/toolkit';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import {
  gameConfigRtkApiEndpoints,
  gameConfigRtkApiMiddleware,
  gameConfigRtkApiReducer,
} from './GameConfigRtkApi';

const apiUrl = 'https://api.test';

export const appRtkHttpAdapterGeneratorProviderMock: AppRtkHttpAdapterGeneratorProvider = {
  generateHttpAdapter: (): HttpAdapter | null => {
    return new Axios(apiUrl);
  }
}

let currentRequest:
  | 'getPublicGameConfigs'
  | 'getPublicGameConfig'
  | 'error' = 'error';

export const server = setupServer(
  http.post(apiUrl + '/games/graphql', () => {
    if (currentRequest === 'getPublicGameConfigs') {
      const response: GetGameConfigsResponseT = {
        data: {
          publicGameConfigs: [],
        },
      };
      return HttpResponse.json(response);
    } else if (currentRequest === 'getPublicGameConfig') {
      const response: GetPublicGameConfigResponseT = {
        data: {
          publicGameConfig: buildPublicGameConfigMock(),
        },
      };
      return HttpResponse.json(response);
    } else if (currentRequest === 'error') {
      return HttpResponse.error();
    }
  }),
);

export const createTestStore = () =>
  // gameUiConfigReducer is needed inside appRtkApiReducer to get gameUiConfig
  configureStore({
    reducer: {
      [appRtkApiReducerPath]: gameConfigRtkApiReducer,
    },
    middleware: (gDM) => gDM({
      thunk: {
        extraArgument: {
          appRtkHttpAdapterGeneratorProvider: appRtkHttpAdapterGeneratorProviderMock,
          logger: useClientLogger(),
        },
      },
    }).concat(gameConfigRtkApiMiddleware),
  });

describe('GameConfigRtkApi', () => {
  beforeAll(() => {
    server.listen();
  });

  afterEach(() => {
    server.resetHandlers();
  });

  afterAll(() => server.close());

  describe('getPublicGameConfigs', () => {
    it('fetches game instance', async () => {
      const store = createTestStore();

      currentRequest = 'getPublicGameConfigs';
      const rtkResult = await store.dispatch(
        gameConfigRtkApiEndpoints.getPublicGameConfigs.initiate(['GC1'])
      );
      if (rtkResult.data === undefined) {
        throw new Error('rtkResult.data is undefined');
      }

      expect(rtkResult.data.publicGameConfigs).toHaveLength(0);
    });

    it('handles error', async () => {
      const store = createTestStore();

      currentRequest = 'error';
      const rtkResult = await store.dispatch(
        gameConfigRtkApiEndpoints.getPublicGameConfigs.initiate(['GC1'])
      );

      expect(rtkResult.error).toBeTruthy();
      expect(rtkResult.data).toBeUndefined();
    });
  });

  describe('getPublicGameConfig', () => {
    it('fetches game instance', async () => {
      const store = createTestStore();

      currentRequest = 'getPublicGameConfig';
      const rtkResult = await store.dispatch(
        gameConfigRtkApiEndpoints.getPublicGameConfig.initiate('GC1')
      );
      if (rtkResult.data === undefined) {
        throw new Error('rtkResult.data is undefined');
      }

      expect(rtkResult.data.publicGameConfig).not.toBeNull();
    });

    it('handles error', async () => {
      const store = createTestStore();

      currentRequest = 'error';
      const rtkResult = await store.dispatch(
        gameConfigRtkApiEndpoints.getPublicGameConfig.initiate('GC1')
      );

      expect(rtkResult.error).toBeTruthy();
      expect(rtkResult.data).toBeUndefined();
    });
  });
});
