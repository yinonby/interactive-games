
import { Axios, type HttpAdapter } from '@ig/client-utils';
import {
    appRtkApiReducerPath,
    useClientLogger, type AppRtkHttpAdapterGeneratorProvider
} from '@ig/engine-ui';
import type {
    GameInstanceIdT,
    GetGameInstancesResponseT
} from '@ig/games-models';
import { configureStore } from '@reduxjs/toolkit';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import {
    gameRtkApiEndpoints,
    gameRtkApiMiddleware, gameRtkApiReducer
} from './GameRtkApi';

const apiUrl = 'https://api.test';

export const appRtkHttpAdapterGeneratorProviderMock: AppRtkHttpAdapterGeneratorProvider = {
  generateHttpAdapter: (): HttpAdapter | null => {
    return new Axios(apiUrl);
  }
}

let gameInstanceIds: GameInstanceIdT[];

export const server = setupServer(
  // get game-instances
  http.get(apiUrl + '/games/game/gcid-1/game-instance-ids', () => {
    return HttpResponse.json({ gameInstanceIds: gameInstanceIds });
  }),
  http.get(apiUrl + '/games/game/gcid-2/game-instance-ids', () => {
    return HttpResponse.error();
  }),
);

export const createTestStore = () =>
  // gameUiConfigReducer is needed inside appRtkApiReducer to get gameUiConfig
  configureStore({
    reducer: {
      [appRtkApiReducerPath]: gameRtkApiReducer,
    },
    middleware: (gDM) => gDM({
      thunk: {
        extraArgument: {
          appRtkHttpAdapterGeneratorProvider: appRtkHttpAdapterGeneratorProviderMock,
          logger: useClientLogger(),
        },
      },
    }).concat(gameRtkApiMiddleware),
  });

describe('GameRtkApi', () => {
  beforeAll(() => {
    server.listen();
  });
  beforeEach(() => {
    gameInstanceIds = ['giid-1'];
  })
  afterEach(() => {
    server.resetHandlers();
  });
  afterAll(() => server.close());

  it('fetches game instances', async () => {
    const store = createTestStore();

    const result = await store.dispatch(
      gameRtkApiEndpoints.getGameInstances.initiate('gcid-1')
    );
    if (result.data === undefined) {
      throw new Error('result.data is undefined');
    }

    const getGameInstanceResponse: GetGameInstancesResponseT = result.data;
    expect(getGameInstanceResponse.gameInstanceIds).toHaveLength(1);
  });

  it('does not fetch game instance when game instance id is invalid', async () => {
    const store = createTestStore();

    const result = await store.dispatch(
      gameRtkApiEndpoints.getGameInstances.initiate('gcid-2')
    );

    expect(result.isError).toBeTruthy();
    expect(result.data).toBeUndefined();
  });
});
