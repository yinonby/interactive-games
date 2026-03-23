
import { type AppDispatch } from '@ig/app-engine-ui';
import { createWebsocketChatUpdatesMessageHandler, type ChatWebsocketUpdatesConfigT } from './ChatWebSocketController';

// mocks
jest.mock(
  '../domains/chat/controller/ws-actions/ChatUpdateWebSocketController',
  () => ({
    handleChatUpdateWebSocketMessage: jest.fn(),
  })
);

// import after mocks
import {
  handleChatUpdateWebSocketMessage,
} from '../domains/chat/controller/ws-actions/ChatUpdateWebSocketController';

// tests

describe('createWebsocketChatUpdatesMessageHandler', () => {
  const dispatch = jest.fn() as unknown as AppDispatch;
  const config = {
    chatUpdateNotificationName: 'chatUpdateNotification',
    conversationIdFieldName: 'conversationId',
  } as ChatWebsocketUpdatesConfigT;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('handles update messages, no payload', () => {
    const wasHandled = createWebsocketChatUpdatesMessageHandler(config)(
      config.chatUpdateNotificationName,
      { conversationId: 'C1' },
      dispatch,
    );

    expect(wasHandled).toBe(true);
    expect(handleChatUpdateWebSocketMessage).toHaveBeenCalledTimes(1);
    expect(handleChatUpdateWebSocketMessage).toHaveBeenCalledWith(
      config.conversationIdFieldName,
      { conversationId: 'C1' },
      dispatch
    );
  });

  it('handles update messages, with payload', () => {
    const wasHandled = createWebsocketChatUpdatesMessageHandler(config)(
      config.chatUpdateNotificationName,
      undefined,
      dispatch,
    );

    expect(wasHandled).toBe(true);
    expect(handleChatUpdateWebSocketMessage).toHaveBeenCalledTimes(1);
    expect(handleChatUpdateWebSocketMessage).toHaveBeenCalledWith(
      config.conversationIdFieldName,
      undefined,
      dispatch
    );
  });

  it('does not handle other messages', () => {
    const wasHandled = createWebsocketChatUpdatesMessageHandler(config)(
      'invalid-message',
      undefined,
      dispatch,
    );

    expect(wasHandled).toBe(false);
    expect(handleChatUpdateWebSocketMessage).not.toHaveBeenCalled();
  });
});
