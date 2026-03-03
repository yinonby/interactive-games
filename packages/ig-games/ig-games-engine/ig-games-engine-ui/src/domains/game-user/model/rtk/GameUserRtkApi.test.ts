
import {
  appRtkApiReducerPath,
  useClientLogger, type AppRtkHttpAdapterGeneratorProvider
} from '@ig/app-engine-ui';
import { Axios, type HttpAdapter } from '@ig/client-utils';
import type { AddGameConfigIdResponseT, GetPublicGameUserResponseT } from '@ig/games-engine-models';
import { buildPublicGameUserMock } from '@ig/games-engine-models/test-utils';
import { configureStore } from '@reduxjs/toolkit';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import {
  gameUserRtkApiEndpoints,
  gameUserRtkApiMiddleware, gameUserRtkApiReducer
} from './GameUserRtkApi';

const apiUrl = 'https://api.test';

export const appRtkHttpAdapterGeneratorProviderMock: AppRtkHttpAdapterGeneratorProvider = {
  generateHttpAdapter: (): HttpAdapter | null => {
    return new Axios(apiUrl);
  }
}

let currentRequest:
  | 'getPublicGameUser'
  | 'addGameConfigId'
  | 'error' = 'error';

export const server = setupServer(
  http.post(apiUrl + '/games/graphql', () => {
    if (currentRequest === 'getPublicGameUser') {
      const response: GetPublicGameUserResponseT = {
        data: {
          publicGameUser: buildPublicGameUserMock(),
        },
      };
      return HttpResponse.json(response);
    } else if (currentRequest === 'addGameConfigId') {
      const response: AddGameConfigIdResponseT = {
        data: {
          addGameConfigIdResult: {
            gameUserId: 'USER1',
          }
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
      [appRtkApiReducerPath]: gameUserRtkApiReducer,
    },
    middleware: (gDM) => gDM({
      thunk: {
        extraArgument: {
          appRtkHttpAdapterGeneratorProvider: appRtkHttpAdapterGeneratorProviderMock,
          logger: useClientLogger(),
        },
      },
    }).concat(gameUserRtkApiMiddleware),
  });

describe('GameUserRtkApi', () => {
  beforeAll(() => {
    server.listen();
  });

  afterEach(() => {
    server.resetHandlers();
  });

  afterAll(() => server.close());

  describe('getPublicGameUser', () => {
    it('fetches game instance', async () => {
      const store = createTestStore();

      currentRequest = 'getPublicGameUser';
      const rtkResult = await store.dispatch(
        gameUserRtkApiEndpoints.getPublicGameUser.initiate()
      );
      if (rtkResult.data === undefined) {
        throw new Error('rtkResult.data is undefined');
      }

      expect(rtkResult.data.publicGameUser).not.toEqual(null);
    });

    it('handles error', async () => {
      const store = createTestStore();

      currentRequest = 'error';
      const rtkResult = await store.dispatch(
        gameUserRtkApiEndpoints.getPublicGameUser.initiate()
      );

      expect(rtkResult.error).toBeTruthy();
      expect(rtkResult.data).toBeUndefined();
    });
  });

  describe('addGameConfigId', () => {
    it('posts join game request', async () => {
      const store = createTestStore();

      currentRequest = 'addGameConfigId';
      const rtkResult = await store.dispatch(
        gameUserRtkApiEndpoints.addGameConfigId.initiate({ gameConfigId: 'GC1' })
      );
      if (rtkResult.data === undefined) {
        throw new Error('rtkResult.data is undefined');
      }

      expect(rtkResult.data.addGameConfigIdResult).toEqual({ gameUserId: 'USER1' });
    });

    it('handles error', async () => {
      const store = createTestStore();

      currentRequest = 'error';
      const rtkResult = await store.dispatch(
        gameUserRtkApiEndpoints.addGameConfigId.initiate({ gameConfigId: 'GC1' })
      );

      expect(rtkResult.error).toBeTruthy();
      expect(rtkResult.data).toBeUndefined();
    });
  });
});
