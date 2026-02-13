
import { useClientLogger, type AppRtkHttpAdapterGeneratorProvider } from '@ig/app-engine-ui';
import type { GuestLoginResponseT, GuestLoginResultT } from '@ig/auth-models';
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

const guestLoginResponse: GuestLoginResponseT = { data: { guestLoginResult: { accountId: 'ACCOUNT1' }}};

export const server = setupServer(
  http.post(apiUrl + '/auth/graphql', () => {
    return HttpResponse.json({
      ...guestLoginResponse,
    });
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

  it('posts a guest login request', async () => {
    const store = createTestStore();

    const response = await store.dispatch(
      authRtkApiEndpoints.guestLogin.initiate()
    );
    const result: GuestLoginResultT | undefined = response.data;

    if (result === undefined) {
      throw new Error('result.data is undefined');
    }
    expect(result).toEqual(guestLoginResponse.data);
  });
});
