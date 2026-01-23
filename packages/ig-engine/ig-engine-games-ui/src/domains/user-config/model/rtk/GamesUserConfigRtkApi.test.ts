
import { Axios, type HttpAdapter } from '@ig/client-utils';
import {
  appRtkApiReducerPath,
  useClientLogger,
  type AppRtkHttpAdapterGeneratorProvider
} from "@ig/engine-app-ui";
import type {
  GameConfigT,
  GamesUserConfigT,
  GetGamesUserConfigResponseT, MinimalGameInstanceExposedInfoT,
  PostAcceptInviteRequestBodyT, PostAcceptInviteResponseT, PostAddGameInstanceResponseT, PostPlayGameRequestBodyT, PostPlayGameResponseT
} from "@ig/engine-models";
import { configureStore } from '@reduxjs/toolkit';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import {
  gamesUserConfigRtkApiEndpoints, gamesUserConfigRtkApiMiddleware,
  gamesUserConfigRtkApiReducer
} from "./GamesUserConfigRtkApi";

const apiUrl = 'https://api.test';

export const appRtkHttpAdapterGeneratorProviderMock: AppRtkHttpAdapterGeneratorProvider = {
  generateHttpAdapter: (): HttpAdapter | null => {
    return new Axios(apiUrl);
  }
}

let mockedGamesUserConfig: GamesUserConfigT = {
  joinedGameConfigs: [],
  minimalGameInstanceExposedInfos: [],
};

export const server = setupServer(
  http.get(apiUrl + '/games/user-config', () => {
    return HttpResponse.json({ gamesUserConfig: mockedGamesUserConfig });
  }),

  http.post(apiUrl + '/games/user-config', async ({ request }) => {
    const body = await request.json() as { gameCode: string };

    mockedGamesUserConfig.minimalGameInstanceExposedInfos.push({
      gameInstanceId: "giid-" + body.gameCode,
    } as MinimalGameInstanceExposedInfoT);

    return new HttpResponse(null, { status: 200 });
  }),

  http.post(apiUrl + '/games/user-config/play-game', async ({ request }) => {
    const body = await request.json() as PostPlayGameRequestBodyT;

    mockedGamesUserConfig.joinedGameConfigs.push({
      gameConfigId: body.gameConfigId,
    } as GameConfigT);

    const response: PostPlayGameResponseT = {
      status: 'ok',
    };
    return HttpResponse.json(response);
  }),

  http.post(apiUrl + '/games/user-config/accept-invite', async ({ request }) => {
    const body = await request.json() as PostAcceptInviteRequestBodyT;

    const gameInstanceId = "giid-" + body.invitationCode;
    mockedGamesUserConfig.minimalGameInstanceExposedInfos.push({
      gameInstanceId: gameInstanceId,
    } as MinimalGameInstanceExposedInfoT);

    const response: PostAcceptInviteResponseT = {
      gameInstanceId: gameInstanceId,
    };
    return HttpResponse.json(response);
  }),

  http.post(apiUrl + '/games/user-config/add-game-instance', async ({ request }) => {
    const body = await request.json() as PostPlayGameRequestBodyT;

    const gameInstanceId = "giid-" + body.gameConfigId;
    mockedGamesUserConfig.minimalGameInstanceExposedInfos.push({
      gameInstanceId: gameInstanceId,
    } as MinimalGameInstanceExposedInfoT);

    const response: PostAddGameInstanceResponseT = {
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
  afterEach(() => {
    server.resetHandlers();

    mockedGamesUserConfig = {
      joinedGameConfigs: [],
      minimalGameInstanceExposedInfos: [],
    };
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
      joinedGameConfigs: [],
      minimalGameInstanceExposedInfos: [],
    });
  });

  it('posts a play-game request and invalidates cache', async () => {
    const store = createTestStore();

    // Initial fetch
    const result1 = await store.dispatch(
      gamesUserConfigRtkApiEndpoints.getGamesUserConfig.initiate()
    );
    if (result1.data === undefined) {
      throw new Error('result1.data is undefined');
    }

    const getGamesUserConfigResponse1: GetGamesUserConfigResponseT = result1.data;
    expect(getGamesUserConfigResponse1.gamesUserConfig.minimalGameInstanceExposedInfos.length).toEqual(0);

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
    expect(getGamesUserConfigResponse2.gamesUserConfig.joinedGameConfigs.length).toEqual(1);
    expect(getGamesUserConfigResponse2.gamesUserConfig.joinedGameConfigs[0].gameConfigId).toEqual("GAME_123");
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
    expect(getGamesUserConfigResponse1.gamesUserConfig.minimalGameInstanceExposedInfos.length).toEqual(0);

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
    expect(getGamesUserConfigResponse2.gamesUserConfig.minimalGameInstanceExposedInfos.length).toEqual(1);
    expect(getGamesUserConfigResponse2.gamesUserConfig.minimalGameInstanceExposedInfos[0].gameInstanceId).toEqual("giid-INVT_12");
  });

  it('posts an add-game-instance request and invalidates cache', async () => {
    const store = createTestStore();

    // Initial fetch
    const result1 = await store.dispatch(
      gamesUserConfigRtkApiEndpoints.getGamesUserConfig.initiate()
    );
    if (result1.data === undefined) {
      throw new Error('result1.data is undefined');
    }

    const getGamesUserConfigResponse1: GetGamesUserConfigResponseT = result1.data;
    expect(getGamesUserConfigResponse1.gamesUserConfig.minimalGameInstanceExposedInfos.length).toEqual(0);

    // Mutation
    await store.dispatch(
      gamesUserConfigRtkApiEndpoints.addGameInstance.initiate('GAME_123')
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
    expect(getGamesUserConfigResponse2.gamesUserConfig.minimalGameInstanceExposedInfos.length).toEqual(1);
    expect(getGamesUserConfigResponse2.gamesUserConfig.minimalGameInstanceExposedInfos[0].gameInstanceId).toEqual("giid-GAME_123");
  });
});
