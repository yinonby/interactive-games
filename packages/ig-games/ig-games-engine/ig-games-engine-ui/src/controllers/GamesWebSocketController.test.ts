
import { useClientLogger, type AppDispatch } from '@ig/app-engine-ui';
import { createWebsocketChatUpdatesMessageHandler, type ChatWebsocketUpdatesConfigT } from '@ig/chat-ui';
import type { LoggerAdapter } from '@ig/utils';
import {
  createGameInstanceUpdatesWebsocketMessageHandler,
  type GameInstanceWebsocketUpdatesConfigT,
} from '../domains/game-instance/controller/ws-actions/GameInstanceWebSocketController';
import { createWebsocketMessageHandler, type WebsocketUpdatesConfigT } from './GamesWebSocketController';

jest.mock('@ig/chat-ui', () => ({
  createWebsocketChatUpdatesMessageHandler: jest.fn(),
}));

jest.mock('../domains/game-instance/controller/ws-actions/GameInstanceWebSocketController', () => ({
  createGameInstanceUpdatesWebsocketMessageHandler: jest.fn(),
}));

// tests

describe('createWebsocketMessageHandler', () => {
  const dispatch = jest.fn() as unknown as AppDispatch;
  const logger: LoggerAdapter = useClientLogger();

  const config: WebsocketUpdatesConfigT = {
    gameInstanceWebsocketUpdatesConfig: {
      gameInstanceUpdateNotificationName: 'gameInstanceUpdateNotification',
    } as GameInstanceWebsocketUpdatesConfigT,
    chatWebsocketUpdatesConfig: {
      chatUpdateNotificationName: 'chatUpdateNotification',
    } as ChatWebsocketUpdatesConfigT,
  }

  const mock_createGameInstanceUpdatesWebsocketMessageHandler =
    createGameInstanceUpdatesWebsocketMessageHandler as jest.Mock;
  const mock_createWebsocketChatUpdatesMessageHandler =
    createWebsocketChatUpdatesMessageHandler as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('handles games instance ipdate notification', () => {
    // setup mocks
    const mock_handler = jest.fn();
    mock_createGameInstanceUpdatesWebsocketMessageHandler.mockReturnValue(mock_handler);
    const payload = { gameInstanceId: '123' };

    const wasHandled = createWebsocketMessageHandler(config)(
      config.gameInstanceWebsocketUpdatesConfig.gameInstanceUpdateNotificationName,
      payload,
      dispatch,
      logger,
    );

    expect(wasHandled).toBe(true);
    expect(mock_createGameInstanceUpdatesWebsocketMessageHandler).toHaveBeenCalledWith(
      config.gameInstanceWebsocketUpdatesConfig,
    );
    expect(mock_handler).toHaveBeenCalledWith(
      config.gameInstanceWebsocketUpdatesConfig.gameInstanceUpdateNotificationName,
      payload,
      dispatch,
    );
  });

  it('handles chat ipdate notification', () => {
    // setup mocks
    const mock_handler = jest.fn();
    mock_createWebsocketChatUpdatesMessageHandler.mockReturnValue(mock_handler);
    const payload = { gameInstanceId: '123' };

    const wasHandled = createWebsocketMessageHandler(config)(
      config.chatWebsocketUpdatesConfig.chatUpdateNotificationName,
      payload,
      dispatch,
      logger,
    );

    expect(wasHandled).toBe(true);
    expect(mock_createWebsocketChatUpdatesMessageHandler).toHaveBeenCalledTimes(1);
    expect(mock_createWebsocketChatUpdatesMessageHandler).toHaveBeenCalledWith(
      config.chatWebsocketUpdatesConfig,
    );
    expect(mock_handler).toHaveBeenCalledWith(
      config.chatWebsocketUpdatesConfig.chatUpdateNotificationName,
      payload,
      dispatch,
    )
  });

  it('does not handle other messages', () => {
    const wasHandled = createWebsocketMessageHandler(config)(
      'invalid-message',
      undefined,
      dispatch,
      logger,
    );

    expect(wasHandled).toBe(false);
    expect(mock_createGameInstanceUpdatesWebsocketMessageHandler).not.toHaveBeenCalled();
  });
});
