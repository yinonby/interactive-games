
import { type GamesRequestAdapter } from '@ig/games-engine-be-models';
import type { GamesApiServerErrorCodeT } from '@ig/games-engine-models';
import type { Request } from 'express';
import { GraphQLError, type GraphQLFormattedError } from 'graphql';
import { GamesApiError } from '../../types/GamesPluginTypes';
import { buildContext, formatErrorFn } from './GraphqlUtils';

describe('formatErrorFn', () => {
  it('should format GamesApiError correctly', () => {
    const originalError = new GamesApiError('Test message', 'gamesApiError:testCode' as GamesApiServerErrorCodeT);
    const gqlError = new GraphQLError('dummy', { originalError });
    const formattedError: GraphQLFormattedError = {
      message: gqlError.message,
      locations: [{ line: 1, column: 2 }],
      path: ['testPath'],
      extensions: {},
    };

    const formatted = formatErrorFn(formattedError, gqlError);

    expect(formatted).toEqual({
      message: 'Test message',
      locations: [{ line: 1, column: 2 }],
      path: ['testPath'],
      extensions: { appErrCode: 'gamesApiError:testCode' },
    });
  });

  it('should mask unknown errors', () => {
    const unknownError = new Error('oops');
    const gqlError = new GraphQLError('dummy', { originalError: unknownError });
    const formattedError: GraphQLFormattedError = {
      message: gqlError.message,
      locations: [{ line: 1, column: 2 }],
      path: ['testPath'],
      extensions: {},
    };

    const formatted = formatErrorFn(formattedError, gqlError);

    expect(formatted).toEqual({
      message: 'Internal server error',
      locations: [{ line: 1, column: 2 }],
      path: ['testPath'],
      extensions: { appErrCode: 'gamesApiError:unknownError' },
    });
  });
});

describe('buildContext', () => {
  const mockReq = {} as Request;

  it('should return context when gameUserId exists', async () => {
    const jwtAdapter: GamesRequestAdapter = {
      extractGameUserId: vi.fn().mockReturnValue('USER1'),
    };

    const ctx = await buildContext(mockReq, jwtAdapter);

    expect(ctx).toEqual({ gameUserId: 'USER1' });
    expect(jwtAdapter.extractGameUserId).toHaveBeenCalledWith(mockReq);
  });

  it('should throw GraphQLError when gameUserId is missing', async () => {
    const jwtAdapter: GamesRequestAdapter = {
      extractGameUserId: vi.fn().mockReturnValue(null),
    };

    try {
      await buildContext(mockReq, jwtAdapter);
    } catch (err) {
      const gqlErr = err as GraphQLError;
      expect(gqlErr.message).toBe('Not authenticated');
      expect(gqlErr.extensions?.code).toBe('gamesApiError:notAuthenticated');
    }
  });
});