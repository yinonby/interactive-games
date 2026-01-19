
import type { GetGamesConfigResponseT } from "@ig/engine-models";
import { configureStore } from '@reduxjs/toolkit';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { gameUiConfigReducer, gameUiConfigReducerPath } from "../../../../app/model/reducers/GameUiConfigReducer";
import { appRtkApiMiddleware, appRtkApiReducer, appRtkApiReducerPath } from "../../../../app/model/rtk/AppRtkApi";
import type { GameUiConfigT } from "../../../../types/GameUiConfigTypes";
import { gamesConfigRtkApiEndpoints } from "./GamesConfigRtkApi";

const gamesConfigResponse: GetGamesConfigResponseT = { availableMinimalGameConfigs: [] };

export const server = setupServer(
  http.get('https://api.test/games/games-config', () => {
    return HttpResponse.json(gamesConfigResponse);
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
      [appRtkApiReducerPath]: appRtkApiReducer,
      [gameUiConfigReducerPath]: gameUiConfigReducer,
    },
    middleware: (gDM) => gDM().concat(appRtkApiMiddleware),
    preloadedState: {
      [gameUiConfigReducerPath]: {
        gameUiConfig: gameUiConfig,
      }
    }
  });

describe('GamesConfigRtkApi', () => {
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
      gamesConfigRtkApiEndpoints.getGamesConfig.initiate()
    );
    const response: GetGamesConfigResponseT | undefined = result.data;

    if (response === undefined) {
      throw new Error('result.data is undefined');
    }
    expect(response).toEqual(gamesConfigResponse);
  });
});
