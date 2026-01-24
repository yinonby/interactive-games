
import { useClientLogger, type AppDispatch } from '@ig/engine-ui';
import type { GamesWebSocketMessagePayloadT, GamesWebSocketMsgKindT } from '@ig/games-models';
import type { LoggerAdapter } from '@ig/lib';
import { handleGamesWebSocketMessage } from './GamesWebSocketController';

// mocks
jest.mock(
  '../domains/user-config/controller/ws-actions/GamesUserConfigWebSocketController',
  () => ({
    handleGamesUserConfigWebSocketMessage: jest.fn(),
  })
);

jest.mock(
  '../domains/game-instance/controller/ws-actions/GameInstanceWebSocketController',
  () => ({
    handleGamesInstanceWebSocketMessage: jest.fn(),
  })
);

// import after mocks
import {
  handleGamesUserConfigWebSocketMessage,
} from '../domains/user-config/controller/ws-actions/GamesUserConfigWebSocketController';

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

  it('handles gamesUserConfigUpdate messages', () => {
    const wassHandled = handleGamesWebSocketMessage(
      'gamesUserConfigUpdate',
      undefined,
      dispatch,
      logger,
    );

    expect(wassHandled).toBe(true);
    expect(handleGamesUserConfigWebSocketMessage).toHaveBeenCalledTimes(1);
    expect(handleGamesUserConfigWebSocketMessage).toHaveBeenCalledWith(
      'gamesUserConfigUpdate',
      dispatch
    );

    expect(handleGamesInstanceWebSocketMessage).not.toHaveBeenCalled();
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

    expect(handleGamesUserConfigWebSocketMessage).not.toHaveBeenCalled();
  });

  it('does not handle other messages', () => {
    const wassHandled = handleGamesWebSocketMessage(
      'invalid-message' as GamesWebSocketMsgKindT,
      undefined,
      dispatch,
      logger,
    );

    expect(wassHandled).toBe(false);
    expect(handleGamesUserConfigWebSocketMessage).not.toHaveBeenCalled();
    expect(handleGamesInstanceWebSocketMessage).not.toHaveBeenCalled();
  });
});
