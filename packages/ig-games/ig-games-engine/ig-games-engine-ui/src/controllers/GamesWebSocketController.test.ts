
import { useClientLogger, type AppDispatch } from '@ig/app-engine-ui';
import type { GamesWebSocketMessagePayloadT, GamesWebSocketMsgKindT } from '@ig/games-engine-models';
import type { LoggerAdapter } from '@ig/utils';
import { handleGamesWebSocketMessage } from './GamesWebSocketController';

jest.mock(
  '../domains/game-instance/controller/ws-actions/GameInstanceWebSocketController',
  () => ({
    handleGamesInstanceWebSocketMessage: jest.fn(),
  })
);

// import after mocks

import {
  handleGamesInstanceWebSocketMessage,
} from '../domains/game-instance/controller/ws-actions/GameInstanceWebSocketController';

// tests

describe('handleGamesWebSocketMessage', () => {
  const dispatch = jest.fn() as unknown as AppDispatch;
  const logger: LoggerAdapter = useClientLogger();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('handles gamesInstanceUpdate messages', () => {
    const payload: GamesWebSocketMessagePayloadT = { gameInstanceId: '123' };

    const wassHandled = handleGamesWebSocketMessage(
      'gamesInstanceUpdate',
      payload,
      dispatch,
      logger,
    );

    expect(wassHandled).toBe(true);
    expect(handleGamesInstanceWebSocketMessage).toHaveBeenCalledTimes(1);
    expect(handleGamesInstanceWebSocketMessage).toHaveBeenCalledWith(
      'gamesInstanceUpdate',
      payload,
      dispatch,
    );
  });

  it('does not handle other messages', () => {
    const wassHandled = handleGamesWebSocketMessage(
      'invalid-message' as GamesWebSocketMsgKindT,
      undefined,
      dispatch,
      logger,
    );

    expect(wassHandled).toBe(false);
    expect(handleGamesInstanceWebSocketMessage).not.toHaveBeenCalled();
  });
});
