
import { Axios, type HttpAdapter } from '@ig/client-utils';
import {
  appRtkApiReducerPath,
  useClientLogger,
  type AppRtkHttpAdapterGeneratorProvider
} from "@ig/engine-app-ui";
import type {
  GetGamesUserConfigResponseT, MinimalGameInstanceExposedInfoT,
  PostAcceptInviteRequestBodyT, PostAcceptInviteResponseT, PostPlayGameRequestBodyT, PostPlayGameResponseT
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

let gamesUserConfigMock = { minimalGameInstanceExposedInfos: [] as MinimalGameInstanceExposedInfoT[] };

export const server = setupServer(
  http.get(apiUrl + '/games/user-config', () => {
    return HttpResponse.json({ gamesUserConfig: gamesUserConfigMock });
  }),

  http.post(apiUrl + '/games/user-config', async ({ request }) => {
    const body = await request.json() as { gameCode: string };

    gamesUserConfigMock.minimalGameInstanceExposedInfos.push({
      gameInstanceId: "giid-" + body.gameCode,
    } as MinimalGameInstanceExposedInfoT);

    return new HttpResponse(null, { status: 200 });
  }),

  http.post(apiUrl + '/games/user-config/play-game', async ({ request }) => {
    const body = await request.json() as PostPlayGameRequestBodyT;

    const gameInstanceId = "giid-" + body.gameConfigId;
    gamesUserConfigMock.minimalGameInstanceExposedInfos.push({
      gameInstanceId: gameInstanceId,
    } as MinimalGameInstanceExposedInfoT);

    const response: PostPlayGameResponseT = {
      gameInstanceId: gameInstanceId,
    };
    return HttpResponse.json(response);
  }),

  http.post(apiUrl + '/games/user-config/accept-invite', async ({ request }) => {
    const body = await request.json() as PostAcceptInviteRequestBodyT;

    const gameInstanceId = "giid-" + body.invitationCode;
    gamesUserConfigMock.minimalGameInstanceExposedInfos.push({
      gameInstanceId: gameInstanceId,
    } as MinimalGameInstanceExposedInfoT);

    const response: PostAcceptInviteResponseT = {
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
    gamesUserConfigMock = { minimalGameInstanceExposedInfos: [] as MinimalGameInstanceExposedInfoT[] };
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
    expect(getGamesUserConfigResponse.gamesUserConfig).toEqual({ minimalGameInstanceExposedInfos: [] });
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
    expect(getGamesUserConfigResponse2.gamesUserConfig.minimalGameInstanceExposedInfos.length).toEqual(1);
    expect(getGamesUserConfigResponse2.gamesUserConfig.minimalGameInstanceExposedInfos[0].gameInstanceId).toEqual("giid-GAME_123");
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
});
