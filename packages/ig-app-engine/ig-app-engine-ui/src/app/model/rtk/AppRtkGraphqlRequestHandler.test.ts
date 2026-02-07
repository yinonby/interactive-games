
import { type HttpAdapter } from '@ig/client-utils';
import type { LoggerAdapter } from '@ig/utils';
import { handleGraphqlRequest } from './AppRtkGraphqlRequestHandler';

describe('AppRtkGraphqlRequestHandler', () => {
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

  describe('handleGraphqlRequest', () => {
    it('returns data on successful request', async () => {
      const responseData = { foo: 'bar' };
      const response = { data: responseData };
      requestMock.mockResolvedValueOnce(response);

      const document = 'DOCUMENT';
      const result = await handleGraphqlRequest({
        url: '/test',
        graphql: { document: document },
        httpAdapter: httpAdapterMock,
        logger: loggerMock as LoggerAdapter,
      });

      expect(requestMock).toHaveBeenCalledTimes(1);
      expect(requestMock).toHaveBeenCalledWith({
        url: '/test',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apollo-require-preflight': 'true',
        },
        data: { query: document },
      });
      expect(result).toEqual({
        data: responseData,
      });
    });

    it('returns error on failed request, erros is empty', async () => {
      requestMock.mockResolvedValue({
        errors: [],
      });

      const result = await handleGraphqlRequest({
        url: '/test',
        graphql: { document: '' },
        httpAdapter: httpAdapterMock,
        logger: loggerMock as LoggerAdapter,
      });

      expect(requestMock).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        error: {
          status: 500,
          appErrCode: 'appError:unknown',
          errMsg: undefined,
        },
      });
    });

    it('returns error on failed request, erros is not empty', async () => {
      requestMock.mockResolvedValue({
        errors: [{
          message: 'ERROR',
        }],
      });

      const result = await handleGraphqlRequest({
        url: '/test',
        graphql: { document: '' },
        httpAdapter: httpAdapterMock,
        logger: loggerMock as LoggerAdapter,
      });

      expect(requestMock).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        error: {
          status: 500,
          appErrCode: 'appError:unknown',
          errMsg: 'ERROR',
        },
      });
    });
  });
});
