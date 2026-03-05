
import { BeLogger } from '@ig/be-utils';
import { type GamesRequestAdapter } from '@ig/games-engine-be-models';
import { type Request } from 'express';
import { GraphQLError, type GraphQLFormattedError } from 'graphql';
import { GamesApiError, type GamesGraphqlContextT } from '../../types/GamesPluginTypes';

export const formatErrorFn = (formattedError: GraphQLFormattedError, error: unknown): GraphQLFormattedError => {
  const gqlError = error as GraphQLError;
  const originalError = gqlError.originalError;
  const logger = new BeLogger();

  if (originalError instanceof GamesApiError) {
    return {
      message: originalError.message,
      locations: formattedError.locations,
      path: formattedError.path,
      extensions: {
        appErrCode: originalError.gamesErrCode,
      },
    };
  }

  logger.warn('Detected unknown error', originalError);

  // Unknown errors → mask them
  return {
    message: 'Internal server error',
    locations: formattedError.locations,
    path: formattedError.path,
    extensions: {
      appErrCode: 'gamesApiError:unknownError',
    },
  };
};

export const buildContext = async (
  req: Request,
  gamesRequestAdapter: GamesRequestAdapter,
): Promise<GamesGraphqlContextT> => {
  const gameUserId = await gamesRequestAdapter.extractGameUserId(req);

  if (gameUserId === null) {
    throw new GraphQLError('Not authenticated', {
      extensions: { code: 'gamesApiError:notAuthenticated' },
    });
  }

  return { gameUserId, headers: req.headers };
};
