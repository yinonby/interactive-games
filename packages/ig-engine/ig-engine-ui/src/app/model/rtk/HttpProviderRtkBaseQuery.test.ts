
import type { BaseQueryApi } from '@reduxjs/toolkit/query';
import type { HttpAdapter } from '../../../../../../ig-lib/ig-client-utils/src/types/HttpProvider';
import type { GameUiConfigT } from "../../../types/GameUiConfigTypes";
import { startExpectingTestingErrors, stopExpectingTestingErrors } from "../../providers/__mocks__/useClientLogger";
import { gameUiConfigReducerPath } from "../reducers/GameUiConfigReducer";
import { httpProviderBaseQuery } from './HttpProviderRtkBaseQuery';

describe('httpProviderBaseQuery', () => {
  const requestMock: jest.Mock = jest.fn();
  const getStateMock: jest.Mock = jest.fn();
  const getHttpProvider: () => HttpAdapter = () => ({
    request: requestMock,
  }) as unknown as HttpAdapter;

  const api = {
    getState: getStateMock,
  } as unknown as BaseQueryApi;
  const extraOptions = {};

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns data on successful request', async () => {
    const gameUiConfig: GameUiConfigT = {
      apiUrl: 'https://api.test',
      wssUrl: 'https://wss.test',
      appUrl: 'https://app.test',
      isTesting: true,
      isDevel: false,
    }
    getStateMock.mockReturnValueOnce({
      [gameUiConfigReducerPath]: {
        gameUiConfig: gameUiConfig,
      },
    });

    const response = { foo: 'bar' };

    requestMock.mockResolvedValueOnce(response);

    const baseQuery = httpProviderBaseQuery(getHttpProvider);

    const result = await baseQuery(
      {
        url: '/test',
        method: 'GET',
      },
      api,
      extraOptions
    );

    expect(getStateMock).toHaveBeenCalledTimes(1);
    expect(requestMock).toHaveBeenCalledTimes(1);
    expect(requestMock).toHaveBeenCalledWith({
      url: '/test',
      method: 'GET',
      data: undefined,
    });
    expect(result).toEqual({
      data: response,
    });
  });

  it('returns mapped error on failed request', async () => {
    const gameUiConfig: GameUiConfigT = {
      apiUrl: 'https://api.test',
      wssUrl: 'https://wss.test',
      appUrl: 'https://app.test',
      isTesting: true,
      isDevel: false,
    }
    getStateMock.mockReturnValueOnce({
      [gameUiConfigReducerPath]: {
        gameUiConfig: gameUiConfig,
      },
    });

    requestMock.mockRejectedValueOnce({
      status: 401,
      code: 'UNAUTHORIZED',
      message: 'Not authorized',
    });

    const baseQuery = httpProviderBaseQuery(getHttpProvider);

    const result = await baseQuery(
      {
        url: '/test',
        method: 'POST',
        data: { a: 1 },
      },
      api,
      extraOptions
    );

    expect(getStateMock).toHaveBeenCalledTimes(1);
    expect(requestMock).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      error: {
        status: 401,
        code: 'UNAUTHORIZED',
        message: 'Not authorized',
      },
    });
  });

  it('defaults status to 500 when error has no status', async () => {
    const gameUiConfig: GameUiConfigT = {
      apiUrl: 'https://api.test',
      wssUrl: 'https://wss.test',
      appUrl: 'https://app.test',
      isTesting: true,
      isDevel: false,
    }
    getStateMock.mockReturnValueOnce({
      [gameUiConfigReducerPath]: {
        gameUiConfig: gameUiConfig,
      },
    });

    requestMock.mockRejectedValueOnce(new Error('Boom'));

    const baseQuery = httpProviderBaseQuery(getHttpProvider);

    const result = await baseQuery(
      {
        url: '/test',
        method: 'DELETE',
      },
      api,
      extraOptions
    );

    expect(getStateMock).toHaveBeenCalledTimes(1);
    expect(requestMock).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      error: {
        status: 500,
        code: undefined,
        message: 'Boom',
      },
    });
  });

  it('throws error, then defaults status to 500, when gameUiConfig state not found', async () => {
    getStateMock.mockReturnValueOnce({
      [gameUiConfigReducerPath]: {
        gameUiConfig: null,
      }
    });

    const baseQuery = httpProviderBaseQuery(getHttpProvider);

    startExpectingTestingErrors();
    const result = await baseQuery(
      {
        url: '/test',
        method: 'DELETE',
      },
      api,
      extraOptions
    );
    stopExpectingTestingErrors();

    expect(getStateMock).toHaveBeenCalledTimes(1);
    expect(requestMock).not.toHaveBeenCalled();
    expect(result).toEqual({
      error: {
        status: 500,
        code: undefined,
        message: 'Unexpected missing gameUiConfig in state',
      },
    });
  });
});
