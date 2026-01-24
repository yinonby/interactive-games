
import { Axios, type HttpAdapter } from '@ig/client-utils';
import {
  appRtkApiReducerPath,
  useClientLogger,
  type AppRtkHttpAdapterGeneratorProvider
} from "@ig/engine-app-ui";
import type {
  GameConfigT,
  GameInstanceExposedInfoT,
  GamesUserConfigT,
  GetGamesUserConfigResponseT,
  PostAcceptInviteRequestBodyT, PostAcceptInviteResponseT, PostCreateGameInstanceResponseT, PostPlayGameRequestBodyT, PostPlayGameResponseT
} from '@ig/games-models';
import { buildTestGameInstanceExposedInfo } from '@ig/games-models/test-utils';
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
};
let mockedGameInstanceExposedInfos: GameInstanceExposedInfoT[];

export const server = setupServer(
  http.get(apiUrl + '/games/user-config', () => {
    return HttpResponse.json({ gamesUserConfig: mockedGamesUserConfig });
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

    const gameConfigId = "gcid-" + body.invitationCode;
    const gameInstanceId = "giid-" + body.invitationCode;

    mockedGamesUserConfig.joinedGameConfigs.push({
      gameConfigId: gameConfigId,
    } as GameConfigT);

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
      joinedGameConfigs: [],
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
      joinedGameConfigs: [],
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
    expect(getGamesUserConfigResponse1.gamesUserConfig.joinedGameConfigs.length).toEqual(0);

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
    expect(getGamesUserConfigResponse1.gamesUserConfig.joinedGameConfigs.length).toEqual(0);

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
    expect(getGamesUserConfigResponse2.gamesUserConfig.joinedGameConfigs.length).toEqual(1);
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
    expect(getGamesUserConfigResponse1.gamesUserConfig.joinedGameConfigs.length).toEqual(0);

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
    expect(getGamesUserConfigResponse2.gamesUserConfig.joinedGameConfigs.length).toEqual(0);
  });
});
