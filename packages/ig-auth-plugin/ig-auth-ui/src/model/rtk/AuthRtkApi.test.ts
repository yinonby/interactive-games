
import { useClientLogger, type AppRtkHttpAdapterGeneratorProvider } from '@ig/app-engine-ui';
import type { GetLoginInfoReponseT, GuestLoginResponseT } from '@ig/auth-models';
import { Axios, type HttpAdapter } from '@ig/client-utils';
import { configureStore } from '@reduxjs/toolkit';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { authRtkApiEndpoints, authRtkApiMiddleware, authRtkApiReducer, authRtkApiReducerPath } from './AuthRtkApi';

const apiUrl = 'https://api.test';

export const appRtkHttpAdapterGeneratorProviderMock: AppRtkHttpAdapterGeneratorProvider = {
  generateHttpAdapter: (): HttpAdapter | null => {
    return new Axios(apiUrl);
  }
}


const guestLoginResponse: GuestLoginResponseT = { data: { guestLoginResult: { authId: 'ACCOUNT1' }}};
const getLoginInfoReponse: GetLoginInfoReponseT = { data: { loginInfo: { authId: 'ACCOUNT2' }}};
let currentRequest: 'getLoginInfo' | 'guestLogin' | 'error' = 'error';

export const server = setupServer(
  http.post(apiUrl + '/auth/graphql', () => {
    if (currentRequest === 'guestLogin') {
      return HttpResponse.json({
        ...guestLoginResponse,
      });
    } else if  (currentRequest  === 'getLoginInfo') {
      return HttpResponse.json({
        ...getLoginInfoReponse,
      });
    } else if (currentRequest === 'error') {
      return HttpResponse.error();
    }
  }),
);

export const createTestStore = () =>
  configureStore({
    reducer: {
      [authRtkApiReducerPath]: authRtkApiReducer,
    },
    middleware: (gDM) => gDM({
      thunk: {
        extraArgument: {
          appRtkHttpAdapterGeneratorProvider: appRtkHttpAdapterGeneratorProviderMock,
          logger: useClientLogger(),
        },
      },
    }).concat(authRtkApiMiddleware),
  });

describe('AppRtkApi', () => {
  beforeAll(() => {
    server.listen();
  });

  afterEach(() => {
    server.resetHandlers();
  });

  afterAll(() => server.close());

  describe('getLoginInfo', () => {
    it('posts request', async () => {
      const store = createTestStore();

      currentRequest = 'guestLogin';
      const rtkResult = await store.dispatch(
        authRtkApiEndpoints.getLoginInfo.initiate()
      );

      if (rtkResult.data === undefined) {
        throw new Error('rtkResult.data is undefined');
      }
      expect(rtkResult.data).toEqual(guestLoginResponse.data);
    });
  });

  describe('guestLogin', () => {
    it('posts request', async () => {
      const store = createTestStore();

      currentRequest = 'guestLogin';
      const nickname = 'NICKNAME1';
      const rtkResult = await store.dispatch(
        authRtkApiEndpoints.guestLogin.initiate({ nickname })
      );

      if (rtkResult.data === undefined) {
        throw new Error('rtkResult.data is undefined');
      }
      expect(rtkResult.data).toEqual(guestLoginResponse.data);
    });

    it('handles error', async () => {
      const store = createTestStore();

      currentRequest = 'error';
      const nickname = 'NICKNAME1';
      const rtkResult = await store.dispatch(
        authRtkApiEndpoints.guestLogin.initiate({ nickname })
      );

      expect(rtkResult.error).toBeTruthy();
      expect(rtkResult.data).toBeUndefined();
    });
  });
});
