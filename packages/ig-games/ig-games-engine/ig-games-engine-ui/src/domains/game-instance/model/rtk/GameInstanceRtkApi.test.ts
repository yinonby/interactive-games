
import {
  appRtkApiReducerPath,
  useClientLogger, type AppRtkHttpAdapterGeneratorProvider
} from '@ig/app-engine-ui';
import { Axios, type HttpAdapter } from '@ig/client-utils';
import type {
  CreateGameInstanceResponseT,
  GetGameInstanceIdsForGameConfigResponseT,
  GetGameInstanceResponseT,
  JoinGameByInviteResponseT,
  StartPlayingResponseT,
  SubmitGuessResponseT
} from '@ig/games-engine-models';
import { buildPublicGameInstanceMock } from '@ig/games-engine-models/test-utils';
import { configureStore } from '@reduxjs/toolkit';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import {
  gameInstanceRtkApiEndpoints,
  gameInstanceRtkApiMiddleware, gameInstanceRtkApiReducer
} from './GameInstanceRtkApi';

const apiUrl = 'https://api.test';

export const appRtkHttpAdapterGeneratorProviderMock: AppRtkHttpAdapterGeneratorProvider = {
  generateHttpAdapter: (): HttpAdapter | null => {
    return new Axios(apiUrl);
  }
}

let currentRequest:
  | 'getGameInstanceIdsForGameConfig'
  | 'getPublicGameInstance'
  | 'createGameInstace'
  | 'joinGameByInvite'
  | 'startPlaying'
  | 'submitGuess'
  | 'error' = 'error';

export const server = setupServer(
  http.post(apiUrl + '/games/graphql', () => {
    if (currentRequest === 'getGameInstanceIdsForGameConfig') {
      const response: GetGameInstanceIdsForGameConfigResponseT = {
        data: {
          gameInstanceIds: ['GI1'],
        },
      };
      return HttpResponse.json(response);
    } else if (currentRequest === 'getPublicGameInstance') {
      const response: GetGameInstanceResponseT = {
        data: {
          publicGameInstance: buildPublicGameInstanceMock(),
        },
      };
      return HttpResponse.json(response);
    } else if (currentRequest === 'createGameInstace') {
      const response: CreateGameInstanceResponseT = {
        data: {
          createGameInstanceResult: { gameInstanceId: 'GI1' },
        },
      };
      return HttpResponse.json(response);
    } else if (currentRequest === 'joinGameByInvite') {
      const response: JoinGameByInviteResponseT = {
        data: {
          joinGameByInviteResult: { gameInstanceId: 'GI1' },
        },
      };
      return HttpResponse.json(response);
    } else if (currentRequest === 'startPlaying') {
      const response: StartPlayingResponseT = {
        data: {
          startPlayingResult: { status: 'ok' },
        },
      };
      return HttpResponse.json(response);
    } else if (currentRequest === 'submitGuess') {
      const response: SubmitGuessResponseT = {
        data: {
          submitGuessResult: { isGuessCorrect: true },
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
      [appRtkApiReducerPath]: gameInstanceRtkApiReducer,
    },
    middleware: (gDM) => gDM({
      thunk: {
        extraArgument: {
          appRtkHttpAdapterGeneratorProvider: appRtkHttpAdapterGeneratorProviderMock,
          logger: useClientLogger(),
        },
      },
    }).concat(gameInstanceRtkApiMiddleware),
  });

describe('GameInstanceRtkApi', () => {
  beforeAll(() => {
    server.listen();
  });

  afterEach(() => {
    server.resetHandlers();
  });

  afterAll(() => server.close());

  describe('getGameInstanceIdsForGameConfig', () => {
    it('fetches game instance ids', async () => {
      const store = createTestStore();

      currentRequest = 'getGameInstanceIdsForGameConfig';
      const rtkResult = await store.dispatch(
        gameInstanceRtkApiEndpoints.getGameInstanceIdsForGameConfig.initiate('GC1')
      );
      if (rtkResult.data === undefined) {
        throw new Error('result.data is undefined');
      }

      expect(rtkResult.data.gameInstanceIds).toEqual(['GI1']);
    });
  });

  describe('getPublicGameInstance', () => {
    it('fetches game instance', async () => {
      const store = createTestStore();

      currentRequest = 'getPublicGameInstance';
      const rtkResult = await store.dispatch(
        gameInstanceRtkApiEndpoints.getPublicGameInstance.initiate('GI1')
      );
      if (rtkResult.data === undefined) {
        throw new Error('rtkResult.data is undefined');
      }

      expect(rtkResult.data.publicGameInstance).not.toEqual(null);
    });
  });

  describe('createGameInstace', () => {
    it('posts join game request', async () => {
      const store = createTestStore();

      currentRequest = 'createGameInstace';
      const rtkResult = await store.dispatch(
        gameInstanceRtkApiEndpoints.createGameInstace.initiate({ gameConfigId: 'GC1' })
      );
      if (rtkResult.data === undefined) {
        throw new Error('rtkResult.data is undefined');
      }

      expect(rtkResult.data.createGameInstanceResult).toEqual({ gameInstanceId: 'GI1' });
    });

    it('handles error', async () => {
      const store = createTestStore();

      currentRequest = 'error';
      const rtkResult = await store.dispatch(
        gameInstanceRtkApiEndpoints.createGameInstace.initiate({ gameConfigId: 'GC1' })
      );

      expect(rtkResult.error).toBeTruthy();
      expect(rtkResult.data).toBeUndefined();
    });
  });

  describe('joinGameByInvite', () => {
    it('posts join game request', async () => {
      const store = createTestStore();

      currentRequest = 'joinGameByInvite';
      const rtkResult = await store.dispatch(
        gameInstanceRtkApiEndpoints.joinGameByInvite.initiate({ invitationCode: 'INVT1' })
      );
      if (rtkResult.data === undefined) {
        throw new Error('rtkResult.data is undefined');
      }

      expect(rtkResult.data.joinGameByInviteResult).toEqual({ gameInstanceId: 'GI1' });
    });
  });

  describe('startPlaying', () => {
    it('posts start playing request', async () => {
      const store = createTestStore();

      currentRequest = 'startPlaying';
      const rtkResult = await store.dispatch(
        gameInstanceRtkApiEndpoints.startPlaying.initiate({ gameInstanceId: 'GI1' })
      );
      if (rtkResult.data === undefined) {
        throw new Error('rtkResult.data is undefined');
      }

      expect(rtkResult.data.startPlayingResult).toEqual({ status: 'ok' });
    });

    it('posts start playing request, handles error', async () => {
      const store = createTestStore();

      currentRequest = 'error';
      const rtkResult = await store.dispatch(
        gameInstanceRtkApiEndpoints.startPlaying.initiate({ gameInstanceId: 'GI1' })
      );

      expect(rtkResult.error).toBeTruthy();
      expect(rtkResult.data).toBeUndefined();
    });
  });

  describe('submitGuess', () => {
    it('posts submit guess request', async () => {
      const store = createTestStore();

      currentRequest = 'submitGuess';
      const rtkResult = await store.dispatch(
        gameInstanceRtkApiEndpoints.submitGuess.initiate({ gameInstanceId: 'GI1', levelIdx: 1, guess: 'World' })
      );
      if (rtkResult.data === undefined) {
        throw new Error('rtkResult.data is undefined');
      }

      expect(rtkResult.data.submitGuessResult).toEqual({ isGuessCorrect: true });
    });

    it('posts submit guess request, handles error', async () => {
      const store = createTestStore();

      currentRequest = 'error';
      const rtkResult = await store.dispatch(
        gameInstanceRtkApiEndpoints.submitGuess.initiate({ gameInstanceId: 'GI1', levelIdx: 1, guess: 'World' })
      );

      expect(rtkResult.error).toBeTruthy();
      expect(rtkResult.data).toBeUndefined();
    });
  });
});
