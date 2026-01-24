
import { Axios } from '@ig/client-utils';
import type { BaseQueryApi } from '@reduxjs/toolkit/query';
import { ApiServerMock } from '../../../../test/mocks/ApiServerMock';
import { appRtkHttpAdapterGenerator } from './AppReduxUtils';
import { gameUiConfigReducerPath } from './GameUiConfigReducer';

// mocks

jest.mock('../../../../test/mocks/ApiServerMock', () => ({
  ApiServerMock: jest.fn().mockImplementation((url: string) => ({ __mockType: 'ApiServerMock', url })),
}));

jest.mock('@ig/client-utils', () => ({
  Axios: jest.fn().mockImplementation((url: string) => ({ __mockType: 'Axios', url })),
}));

// tests

describe('AppReduxUtils', () => {
  beforeEach(() => {
    (ApiServerMock as jest.Mock).mockClear();
    (Axios as jest.Mock).mockClear();
  });

  it('returns null when gameUiConfig is null', () => {
    const api = {
      getState: () => ({ [gameUiConfigReducerPath]: { gameUiConfig: null } }),
    } as unknown as BaseQueryApi;

    const adapter = appRtkHttpAdapterGenerator.generateHttpAdapter(api);
    expect(adapter).toBeNull();
    expect(ApiServerMock).not.toHaveBeenCalled();
    expect(Axios).not.toHaveBeenCalled();
  });

  it('returns ApiServerMock when gameUiConfig.isDevel is true', () => {
    const apiUrl = 'http://dev.example';
    const api = {
      getState: () => ({ [gameUiConfigReducerPath]: { gameUiConfig: { isDevel: true, apiUrl } } }),
    } as unknown as BaseQueryApi;

    const adapter = appRtkHttpAdapterGenerator.generateHttpAdapter(api);
    expect(ApiServerMock).toHaveBeenCalledTimes(1);
    expect((ApiServerMock as jest.Mock).mock.calls[0][0]).toBe(apiUrl);
    expect(adapter).toEqual({ __mockType: 'ApiServerMock', url: apiUrl });
  });

  it('returns Axios when gameUiConfig.isDevel is false', () => {
    const apiUrl = 'https://prod.example';
    const api = {
      getState: () => ({ [gameUiConfigReducerPath]: { gameUiConfig: { isDevel: false, apiUrl } } }),
    } as unknown as BaseQueryApi;

    const adapter = appRtkHttpAdapterGenerator.generateHttpAdapter(api);
    expect(Axios).toHaveBeenCalledTimes(1);
    expect((Axios as jest.Mock).mock.calls[0][0]).toBe(apiUrl);
    expect(adapter).toEqual({ __mockType: 'Axios', url: apiUrl });
  });
});
