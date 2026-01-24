
import { type HttpAdapter } from '@ig/client-utils';
import type { BaseQueryApi } from '@reduxjs/toolkit/query';
import { createAppRtkBaseQuery } from './AppRtkBaseQuery';

const apiUrl = 'https://api.test';

describe('AppRtkBaseQuery', () => {
  const warnMock = jest.fn();
  const errorMock = jest.fn();
  const generateHttpAdapterMock = jest.fn();

  const api = {
    extra: {
      appRtkHttpAdapterGeneratorProvider: {
        generateHttpAdapter: generateHttpAdapterMock,
      },
      logger: { warn: warnMock, error: errorMock },
    }
  } as unknown as BaseQueryApi;
  const extraOptions = {};

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns data on successful request', async () => {
    const requestMock: jest.Mock = jest.fn();
    const httpAdapterMock: HttpAdapter = {
      request: requestMock,
    }
    generateHttpAdapterMock.mockReturnValueOnce(httpAdapterMock);

    const response = { foo: 'bar' };
    requestMock.mockResolvedValueOnce(response);

    const baseQuery = createAppRtkBaseQuery();

    const result = await baseQuery(
      {
        url: apiUrl + '/test',
        method: 'GET',
      },
      api,
      extraOptions
    );

    expect(requestMock).toHaveBeenCalledTimes(1);
    expect(requestMock).toHaveBeenCalledWith({
      url: apiUrl + '/test',
      method: 'GET',
      data: undefined,
    });
    expect(result).toEqual({
      data: response,
    });
  });

  it('returns mapped error on failed request', async () => {
    const requestMock: jest.Mock = jest.fn();
    const httpAdapterMock: HttpAdapter = {
      request: requestMock,
    }
    generateHttpAdapterMock.mockReturnValueOnce(httpAdapterMock);

    requestMock.mockRejectedValueOnce({
      status: 401,
      code: 'UNAUTHORIZED',
      message: 'Not authorized',
    });

    const baseQuery = createAppRtkBaseQuery();

    const result = await baseQuery(
      {
        url: apiUrl + '/test',
        method: 'POST',
        data: { a: 1 },
      },
      api,
      extraOptions
    );

    expect(requestMock).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      error: {
        status: 401,
        appErrCode: 'appError:unknown',
        errMsg: 'Not authorized',
      },
    });
  });

  it('defaults status to 500 when error has no status', async () => {
    const requestMock: jest.Mock = jest.fn();
    const httpAdapterMock: HttpAdapter = {
      request: requestMock,
    }
    generateHttpAdapterMock.mockReturnValueOnce(httpAdapterMock);
    requestMock.mockRejectedValueOnce(new Error('Boom'));

    const baseQuery = createAppRtkBaseQuery();

    const result = await baseQuery(
      {
        url: apiUrl + '/test',
        method: 'DELETE',
      },
      api,
      extraOptions
    );

    expect(requestMock).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      error: {
        status: 500,
        appErrCode: 'appError:unknown',
        errMsg: 'Boom',
      },
    });
  });

  it('defaults status to 500 when httpAdapter is null', async () => {
    generateHttpAdapterMock.mockReturnValueOnce(null);

    const baseQuery = createAppRtkBaseQuery();

    const result = await baseQuery(
      {
        url: apiUrl + '/test',
        method: 'DELETE',
      },
      api,
      extraOptions
    );

    expect(errorMock).toHaveBeenCalled();
    expect(result).toEqual({
      error: {
        status: 500,
        appErrCode: 'appError:unknown',
        errMsg: 'Unexpected error when generating an httpAdapter',
      },
    });
  });
});
