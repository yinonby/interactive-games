
import { type HttpAdapter } from '@ig/client-utils';
import type { LoggerAdapter } from '@ig/utils';
import { handleDefaultRequest } from './AppRtkDefaultRequestHandler';

describe('AppRtkDefaultRequestHandler', () => {
  const warnMock = jest.fn();
  const errorMock = jest.fn();
  const generateHttpAdapterMock = jest.fn();
  const loggerMock: Partial<LoggerAdapter> = {
    warn: warnMock,
    error: errorMock ,
  };
  const requestMock: jest.Mock = jest.fn();
  const httpAdapterMock: HttpAdapter = {
    request: requestMock,
  }
  generateHttpAdapterMock.mockReturnValueOnce(httpAdapterMock);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('handleDefaultRequest', () => {
    it('returns data on successful request', async () => {
      const response = { foo: 'bar' };
      requestMock.mockResolvedValueOnce(response);

      const result = await handleDefaultRequest({
        url: '/test',
        method: 'GET',
        data: undefined,
        httpAdapter: httpAdapterMock,
        logger: loggerMock as LoggerAdapter,
      });

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

    it('returns error on failed request', async () => {
      requestMock.mockRejectedValueOnce({
        status: 401,
        code: 'UNAUTHORIZED',
        message: 'Not authorized',
      });

      const result = await handleDefaultRequest({
        url: '/test',
        method: 'GET',
        data: undefined,
        httpAdapter: httpAdapterMock,
        logger: loggerMock as LoggerAdapter,
      });

      expect(requestMock).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        error: {
          status: 401,
          appErrCode: 'appError:unknown',
          errMsg: 'Not authorized',
        },
      });
    });
  });
});
