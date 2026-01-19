
import { Axios, type HttpAdapter } from '@ig/client-utils';
import {
  appRtkApiReducerPath,
  useClientLogger,
  type AppRtkHttpAdapterGeneratorProvider
} from "@ig/engine-app-ui";
import type {
  GetUserConfigResponseT, MinimalGameInstanceExposedInfoT,
  PostAcceptInviteRequestBodyT, PostAcceptInviteResponseT, PostPlayGameRequestBodyT, PostPlayGameResponseT
} from "@ig/engine-models";
import { configureStore } from '@reduxjs/toolkit';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import {
  userConfigRtkApiEndpoints, userConfigRtkApiMiddleware,
  userConfigRtkApiReducer
} from "./UserConfigRtkApi";

const apiUrl = 'https://api.test';

export const appRtkHttpAdapterGeneratorProviderMock: AppRtkHttpAdapterGeneratorProvider = {
  generateHttpAdapter: (): HttpAdapter | null => {
    return new Axios(apiUrl);
  }
}

let userConfigMock = { minimalGameInstanceExposedInfos: [] as MinimalGameInstanceExposedInfoT[] };

export const server = setupServer(
  http.get(apiUrl + '/games/user-config', () => {
    return HttpResponse.json({ userConfig: userConfigMock });
  }),

  http.post(apiUrl + '/games/user-config', async ({ request }) => {
    const body = await request.json() as { gameCode: string };

    userConfigMock.minimalGameInstanceExposedInfos.push({
      gameInstanceId: "giid-" + body.gameCode,
    } as MinimalGameInstanceExposedInfoT);

    return new HttpResponse(null, { status: 200 });
  }),

  http.post(apiUrl + '/games/user-config/play-game', async ({ request }) => {
    const body = await request.json() as PostPlayGameRequestBodyT;

    const gameInstanceId = "giid-" + body.gameConfigId;
    userConfigMock.minimalGameInstanceExposedInfos.push({
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
    userConfigMock.minimalGameInstanceExposedInfos.push({
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
      [appRtkApiReducerPath]: userConfigRtkApiReducer,
    },
    middleware: (gDM) => gDM({
      thunk: {
        extraArgument: {
          appRtkHttpAdapterGeneratorProvider: appRtkHttpAdapterGeneratorProviderMock,
          logger: useClientLogger(),
        },
      },
    }).concat(userConfigRtkApiMiddleware),
  });

describe('UserConfigRtkApi', () => {
  beforeAll(() => {
    server.listen();
  });
  afterEach(() => {
    server.resetHandlers();
    userConfigMock = { minimalGameInstanceExposedInfos: [] as MinimalGameInstanceExposedInfoT[] };
  });
  afterAll(() => server.close());

  it('fetches user config', async () => {
    const store = createTestStore();

    const result = await store.dispatch(
      userConfigRtkApiEndpoints.getUserConfig.initiate()
    );
    const getUserConfigResponse: GetUserConfigResponseT | undefined = result.data;

    if (getUserConfigResponse === undefined) {
      throw new Error('result.data is undefined');
    }
    expect(getUserConfigResponse.userConfig).toEqual({ minimalGameInstanceExposedInfos: [] });
  });

  it('adds a game config and invalidates cache', async () => {
    const store = createTestStore();

    // Initial fetch
    const result1 = await store.dispatch(
      userConfigRtkApiEndpoints.getUserConfig.initiate()
    );
    if (result1.data === undefined) {
      throw new Error('result1.data is undefined');
    }

    const getUserConfigResponse1: GetUserConfigResponseT = result1.data;
    expect(getUserConfigResponse1.userConfig.minimalGameInstanceExposedInfos.length).toEqual(0);

    // Mutation
    await store.dispatch(
      userConfigRtkApiEndpoints.addGameConfig.initiate('GAME_123')
    );

    // Re-fetch after invalidation
    const result2 = await store.dispatch(
      userConfigRtkApiEndpoints.getUserConfig.initiate(undefined, {
        forceRefetch: true,
      })
    );
    if (result2.data === undefined) {
      throw new Error('result2.data is undefined');
    }

    const getUserConfigResponse2: GetUserConfigResponseT = result2.data;
    expect(getUserConfigResponse2.userConfig.minimalGameInstanceExposedInfos.length).toEqual(1);
    expect(getUserConfigResponse2.userConfig.minimalGameInstanceExposedInfos[0].gameInstanceId).toEqual("giid-GAME_123");
  });

  it('posts a play-game request and invalidates cache', async () => {
    const store = createTestStore();

    // Initial fetch
    const result1 = await store.dispatch(
      userConfigRtkApiEndpoints.getUserConfig.initiate()
    );
    if (result1.data === undefined) {
      throw new Error('result1.data is undefined');
    }

    const getUserConfigResponse1: GetUserConfigResponseT = result1.data;
    expect(getUserConfigResponse1.userConfig.minimalGameInstanceExposedInfos.length).toEqual(0);

    // Mutation
    await store.dispatch(
      userConfigRtkApiEndpoints.playGame.initiate('GAME_123')
    );

    // Re-fetch after invalidation
    const result2 = await store.dispatch(
      userConfigRtkApiEndpoints.getUserConfig.initiate(undefined, {
        forceRefetch: true,
      })
    );
    if (result2.data === undefined) {
      throw new Error('result2.data is undefined');
    }

    const getUserConfigResponse2: GetUserConfigResponseT = result2.data;
    expect(getUserConfigResponse2.userConfig.minimalGameInstanceExposedInfos.length).toEqual(1);
    expect(getUserConfigResponse2.userConfig.minimalGameInstanceExposedInfos[0].gameInstanceId).toEqual("giid-GAME_123");
  });

  it('posts an accept-invite request and invalidates cache', async () => {
    const store = createTestStore();

    // Initial fetch
    const result1 = await store.dispatch(
      userConfigRtkApiEndpoints.getUserConfig.initiate()
    );
    if (result1.data === undefined) {
      throw new Error('result1.data is undefined');
    }

    const getUserConfigResponse1: GetUserConfigResponseT = result1.data;
    expect(getUserConfigResponse1.userConfig.minimalGameInstanceExposedInfos.length).toEqual(0);

    // Mutation
    await store.dispatch(
      userConfigRtkApiEndpoints.acceptInvite.initiate('INVT_12')
    );

    // Re-fetch after invalidation
    const result2 = await store.dispatch(
      userConfigRtkApiEndpoints.getUserConfig.initiate(undefined, {
        forceRefetch: true,
      })
    );
    if (result2.data === undefined) {
      throw new Error('result2.data is undefined');
    }

    const getUserConfigResponse2: GetUserConfigResponseT = result2.data;
    expect(getUserConfigResponse2.userConfig.minimalGameInstanceExposedInfos.length).toEqual(1);
    expect(getUserConfigResponse2.userConfig.minimalGameInstanceExposedInfos[0].gameInstanceId).toEqual("giid-INVT_12");
  });
});
