
import { useClientLogger, type AppDispatch } from '@ig/app-engine-ui';
import type { LoggerAdapter } from '@ig/utils';
import { handleChatWebSocketMessage } from './ChatWebSocketController';

// mocks
jest.mock(
  '../domains/chat/controller/ws-actions/ChatUpdateWebSocketController',
  () => ({
    handleChatUpdateWebSocketMessage: jest.fn(),
  })
);

// import after mocks
import type { ChatWebSocketMsgKindT } from '@ig/chat-models';
import {
  handleChatUpdateWebSocketMessage,
} from '../domains/chat/controller/ws-actions/ChatUpdateWebSocketController';

// tests

describe('handleChatWebSocketMessage', () => {
  const dispatch = jest.fn() as unknown as AppDispatch;
  const logger: LoggerAdapter = useClientLogger();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('handles chatUpdate messages, no payload', () => {
    const wasHandled = handleChatWebSocketMessage(
      'chatUpdate',
      { conversationId: 'C1' },
      dispatch,
      logger,
    );

    expect(wasHandled).toBe(true);
    expect(handleChatUpdateWebSocketMessage).toHaveBeenCalledTimes(1);
    expect(handleChatUpdateWebSocketMessage).toHaveBeenCalledWith(
      { conversationId: 'C1' },
      dispatch
    );
  });

  it('handles chatUpdate messages, with payload', () => {
    const wasHandled = handleChatWebSocketMessage(
      'chatUpdate',
      undefined,
      dispatch,
      logger,
    );

    expect(wasHandled).toBe(true);
    expect(handleChatUpdateWebSocketMessage).toHaveBeenCalledTimes(1);
    expect(handleChatUpdateWebSocketMessage).toHaveBeenCalledWith(
      undefined,
      dispatch
    );
  });

  it('does not handle other messages', () => {
    const wasHandled = handleChatWebSocketMessage(
      'invalid-message' as ChatWebSocketMsgKindT,
      undefined,
      dispatch,
      logger,
    );

    expect(wasHandled).toBe(false);
    expect(handleChatUpdateWebSocketMessage).not.toHaveBeenCalled();
  });
});
