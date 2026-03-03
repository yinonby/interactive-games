
import { Axios } from '@ig/client-utils';
import type { BaseQueryApi } from '@reduxjs/toolkit/query';
import { appRtkHttpAdapterGenerator } from './AppReduxUtils';
import { gameUiConfigReducerPath } from './GameUiConfigReducer';

// mocks

jest.mock('@ig/client-utils', () => ({
  Axios: jest.fn().mockImplementation((url: string) => ({ __mockType: 'Axios', url })),
}));

// tests

describe('AppReduxUtils', () => {
  beforeEach(() => {
    (Axios as jest.Mock).mockClear();
  });

  it('returns null when gameUiConfig is null', () => {
    const api = {
      getState: () => ({ [gameUiConfigReducerPath]: { gameUiConfig: null } }),
    } as unknown as BaseQueryApi;

    const adapter = appRtkHttpAdapterGenerator.generateHttpAdapter(api);
    expect(adapter).toBeNull();
    expect(Axios).not.toHaveBeenCalled();
  });

  it('returns Axios', () => {
    const apiUrl = 'http://dev.example';
    const api = {
      getState: () => ({ [gameUiConfigReducerPath]: { gameUiConfig: { isDevel: true, apiUrl } } }),
    } as unknown as BaseQueryApi;

    const adapter = appRtkHttpAdapterGenerator.generateHttpAdapter(api, 'url/graphql');
    expect(Axios).toHaveBeenCalledTimes(1);
    expect((Axios as jest.Mock).mock.calls[0][0]).toBe(apiUrl);
    expect(adapter).toEqual({ __mockType: 'Axios', url: apiUrl });
  });
});
