
import {
  appRtkApiReducerPath,
  useClientLogger,
  type AppRtkHttpAdapterGeneratorProvider
} from '@ig/app-engine-ui';
import { Axios, type HttpAdapter } from '@ig/client-utils';
import type {
  GameInfoT,
  GameInstanceExposedInfoT,
  GamesUserConfigT,
  GetGamesUserConfigResponseT,
  PostAcceptInviteRequestBodyT, PostAcceptInviteResponseT, PostCreateGameInstanceResponseT, PostPlayGameRequestBodyT, PostPlayGameResponseT
} from '@ig/games-engine-models';
import { buildTestGameInstanceExposedInfo } from '@ig/games-engine-models/test-utils';
import { configureStore } from '@reduxjs/toolkit';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import {
  gamesUserConfigRtkApiEndpoints, gamesUserConfigRtkApiMiddleware,
  gamesUserConfigRtkApiReducer
} from './GamesUserConfigRtkApi';

const apiUrl = 'https://api.test';

export const appRtkHttpAdapterGeneratorProviderMock: AppRtkHttpAdapterGeneratorProvider = {
  generateHttpAdapter: (): HttpAdapter | null => {
    return new Axios(apiUrl);
  }
}

let mockedGamesUserConfig: GamesUserConfigT = {
  joinedGameInfos: [],
};
let mockedGameInstanceExposedInfos: GameInstanceExposedInfoT[];

export const server = setupServer(
  http.get(apiUrl + '/games/user-config', () => {
    return HttpResponse.json({ gamesUserConfig: mockedGamesUserConfig });
  }),

  http.post(apiUrl + '/games/user-config/play-game', async ({ request }) => {
    const body = await request.json() as PostPlayGameRequestBodyT;

    mockedGamesUserConfig.joinedGameInfos.push({
      gameConfigId: body.gameConfigId,
    } as GameInfoT);

    const response: PostPlayGameResponseT = {
      status: 'ok',
    };
    return HttpResponse.json(response);
  }),

  http.post(apiUrl + '/games/user-config/accept-invite', async ({ request }) => {
    const body = await request.json() as PostAcceptInviteRequestBodyT;

    const gameConfigId = "gcid-" + body.invitationCode;
    const gameInstanceId = "giid-" + body.invitationCode;

    mockedGamesUserConfig.joinedGameInfos.push({
      gameConfigId: gameConfigId,
    } as GameInfoT);

    mockedGameInstanceExposedInfos.push(buildTestGameInstanceExposedInfo({
      gameInstanceId: gameInstanceId,
    }));

    const response: PostAcceptInviteResponseT = {
      gameConfigId: gameConfigId,
      gameInstanceId: gameInstanceId,
    };
    return HttpResponse.json(response);
  }),

  http.post(apiUrl + '/games/user-config/create-game-instance', async ({ request }) => {
    const body = await request.json() as PostPlayGameRequestBodyT;

    const gameInstanceId = "giid-" + body.gameConfigId;
    mockedGameInstanceExposedInfos.push(buildTestGameInstanceExposedInfo({
      gameInstanceId: gameInstanceId,
    }));

    const response: PostCreateGameInstanceResponseT = {
      gameInstanceId: gameInstanceId,
    };
    return HttpResponse.json(response);
  }),
);

export const createTestStore = () =>
  configureStore({
    reducer: {
      [appRtkApiReducerPath]: gamesUserConfigRtkApiReducer,
    },
    middleware: (gDM) => gDM({
      thunk: {
        extraArgument: {
          appRtkHttpAdapterGeneratorProvider: appRtkHttpAdapterGeneratorProviderMock,
          logger: useClientLogger(),
        },
      },
    }).concat(gamesUserConfigRtkApiMiddleware),
  });

describe('GamesUserConfigRtkApi', () => {
  beforeAll(() => {
    server.listen();
  });
  beforeEach(() => {
    mockedGamesUserConfig = {
      joinedGameInfos: [],
    };
    mockedGameInstanceExposedInfos = [];
  })
  afterEach(() => {
    server.resetHandlers();
  });
  afterAll(() => server.close());

  it('fetches user config', async () => {
    const store = createTestStore();

    const result = await store.dispatch(
      gamesUserConfigRtkApiEndpoints.getGamesUserConfig.initiate()
    );
    const getGamesUserConfigResponse: GetGamesUserConfigResponseT | undefined = result.data;

    if (getGamesUserConfigResponse === undefined) {
      throw new Error('result.data is undefined');
    }
    expect(getGamesUserConfigResponse.gamesUserConfig).toEqual({
      joinedGameInfos: [],
    });
  });

  it('posts a play-game request, expects invalidated tags to cause user-config update', async () => {
    const store = createTestStore();

    // Initial fetch
    const result1 = await store.dispatch(
      gamesUserConfigRtkApiEndpoints.getGamesUserConfig.initiate()
    );
    if (result1.data === undefined) {
      throw new Error('result1.data is undefined');
    }

    const getGamesUserConfigResponse1: GetGamesUserConfigResponseT = result1.data;
    expect(getGamesUserConfigResponse1.gamesUserConfig.joinedGameInfos.length).toEqual(0);

    // Mutation
    await store.dispatch(
      gamesUserConfigRtkApiEndpoints.gamesPlayGame.initiate('GAME_123')
    );

    // Re-fetch after invalidation
    const result2 = await store.dispatch(
      gamesUserConfigRtkApiEndpoints.getGamesUserConfig.initiate(undefined, {
        forceRefetch: true,
      })
    );
    if (result2.data === undefined) {
      throw new Error('result2.data is undefined');
    }

    const getGamesUserConfigResponse2: GetGamesUserConfigResponseT = result2.data;
    expect(getGamesUserConfigResponse2.gamesUserConfig.joinedGameInfos.length).toEqual(1);
    expect(getGamesUserConfigResponse2.gamesUserConfig.joinedGameInfos[0].gameConfigId).toEqual("GAME_123");
  });

  it('posts an accept-invite request and invalidates cache', async () => {
    const store = createTestStore();

    // Initial fetch
    const result1 = await store.dispatch(
      gamesUserConfigRtkApiEndpoints.getGamesUserConfig.initiate()
    );
    if (result1.data === undefined) {
      throw new Error('result1.data is undefined');
    }

    const getGamesUserConfigResponse1: GetGamesUserConfigResponseT = result1.data;
    expect(getGamesUserConfigResponse1.gamesUserConfig.joinedGameInfos.length).toEqual(0);

    // Mutation
    await store.dispatch(
      gamesUserConfigRtkApiEndpoints.gamesAcceptInvite.initiate('INVT_12')
    );

    // Re-fetch after invalidation
    const result2 = await store.dispatch(
      gamesUserConfigRtkApiEndpoints.getGamesUserConfig.initiate(undefined, {
        forceRefetch: true,
      })
    );
    if (result2.data === undefined) {
      throw new Error('result2.data is undefined');
    }

    const getGamesUserConfigResponse2: GetGamesUserConfigResponseT = result2.data;
    expect(getGamesUserConfigResponse2.gamesUserConfig.joinedGameInfos.length).toEqual(1);
  });

  it('posts an create-game-instance request and invalidates cache', async () => {
    const store = createTestStore();

    // Initial fetch
    const result1 = await store.dispatch(
      gamesUserConfigRtkApiEndpoints.getGamesUserConfig.initiate()
    );
    if (result1.data === undefined) {
      throw new Error('result1.data is undefined');
    }

    const getGamesUserConfigResponse1: GetGamesUserConfigResponseT = result1.data;
    expect(getGamesUserConfigResponse1.gamesUserConfig.joinedGameInfos.length).toEqual(0);

    // Mutation
    await store.dispatch(
      gamesUserConfigRtkApiEndpoints.createGameInstance.initiate('GAME_123')
    );

    // Re-fetch after invalidation
    const result2 = await store.dispatch(
      gamesUserConfigRtkApiEndpoints.getGamesUserConfig.initiate(undefined, {
        forceRefetch: true,
      })
    );
    if (result2.data === undefined) {
      throw new Error('result2.data is undefined');
    }

    const getGamesUserConfigResponse2: GetGamesUserConfigResponseT = result2.data;
    expect(getGamesUserConfigResponse2.gamesUserConfig.joinedGameInfos.length).toEqual(0);
  });
});
