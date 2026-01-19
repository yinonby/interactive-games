
import type {
  GetUserConfigResponseT, MinimalGameInstanceExposedInfoT,
  PostAcceptInviteRequestBodyT, PostAcceptInviteResponseT, PostPlayGameRequestBodyT, PostPlayGameResponseT
} from "@ig/engine-models";
import { configureStore } from '@reduxjs/toolkit';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { gameUiConfigReducer, gameUiConfigReducerPath } from "../../../../app/model/reducers/GameUiConfigReducer";
import { appRtkApiReducerPath } from "../../../../app/model/rtk/AppRtkApi";
import type { GameUiConfigT } from "../../../../types/GameUiConfigTypes";
import { userConfigRtkApiEndpoints, userConfigRtkApiMiddleware, userConfigRtkApiReducer } from "./UserConfigRtkApi";

let userConfigMock = { minimalGameInstanceExposedInfos: [] as MinimalGameInstanceExposedInfoT[] };

export const server = setupServer(
  http.get('https://api.test/games/user-config', () => {
    return HttpResponse.json({ userConfig: userConfigMock });
  }),

  http.post('https://api.test/games/user-config', async ({ request }) => {
    const body = await request.json() as { gameCode: string };

    userConfigMock.minimalGameInstanceExposedInfos.push({
      gameInstanceId: "giid-" + body.gameCode,
    } as MinimalGameInstanceExposedInfoT);

    return new HttpResponse(null, { status: 200 });
  }),

  http.post('https://api.test/games/user-config/play-game', async ({ request }) => {
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

  http.post('https://api.test/games/user-config/accept-invite', async ({ request }) => {
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

const gameUiConfig: GameUiConfigT = {
  apiUrl: 'https://api.test',
  wssUrl: 'https://wss.test',
  appUrl: 'https://app.test',
  isTesting: true,
  isDevel: false,
}

export const createTestStore = () =>
  configureStore({
    reducer: {
      [appRtkApiReducerPath]: userConfigRtkApiReducer,
      [gameUiConfigReducerPath]: gameUiConfigReducer,
    },
    middleware: (gDM) => gDM().concat(userConfigRtkApiMiddleware),
    preloadedState: {
      [gameUiConfigReducerPath]: {
        gameUiConfig: gameUiConfig,
      }
    }
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
