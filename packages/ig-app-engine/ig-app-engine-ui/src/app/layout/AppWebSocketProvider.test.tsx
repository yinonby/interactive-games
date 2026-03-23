
import type { WebsocketMessageHandlerT } from '@ig/client-utils';
import { act, cleanup, render } from '@testing-library/react-native';
import React from 'react';
import { Text } from 'react-native';
import { AppWebSocketProvider, type AppWebSocketMsgHandlerT } from './AppWebSocketProvider';

// Mocks
const mockDispatch = jest.fn();
const mockLogger = {
  error: jest.fn(),
};
const mockSubscribe = jest.fn();

let capturedHandler: WebsocketMessageHandlerT | undefined;
const mockUnsubscribe = jest.fn();

jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
}));

jest.mock('../providers/useClientLogger', () => ({
  useClientLogger: () => mockLogger,
}));

jest.mock('./AppConfigProvider', () => ({
  useAppWsClient: () => ({
    wsClient: {
      subscribe: (handler: WebsocketMessageHandlerT) => {
        capturedHandler = handler;
        mockSubscribe(handler);
        return mockUnsubscribe;
      },
    },
  }),
}));

describe('AppWebSocketProvider (React Native)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    capturedHandler = undefined;
  });

  afterEach(() => {
    cleanup();
  });

  const renderComponent = (handlers: AppWebSocketMsgHandlerT[]) =>
    render(
      <AppWebSocketProvider appWebSocketMsgHandlers={handlers}>
        <Text testID="child">Child</Text>
      </AppWebSocketProvider>
    );

  it('subscribes on mount', () => {
    renderComponent([]);

    expect(mockSubscribe).toHaveBeenCalledTimes(1);
    expect(typeof capturedHandler).toBe('function');
  });

  it('unsubscribes on unmount', () => {
    const { unmount } = renderComponent([]);

    unmount();

    expect(mockUnsubscribe).toHaveBeenCalledTimes(1);
  });

  it('calls handlers when message is received', () => {
    const handler1 = jest.fn().mockReturnValue(false);
    const handler2 = jest.fn().mockReturnValue(true);

    renderComponent([handler1, handler2]);

    act(() => {
      capturedHandler!('MSG_TYPE', { foo: 'bar' });
    });

    expect(handler1).toHaveBeenCalledWith(
      'MSG_TYPE',
      { foo: 'bar' },
      mockDispatch,
      mockLogger
    );

    expect(handler2).toHaveBeenCalledWith(
      'MSG_TYPE',
      { foo: 'bar' },
      mockDispatch,
      mockLogger
    );
  });

  it('allows multiple handlers to handle the same message', () => {
    const handler1 = jest.fn().mockReturnValue(true);
    const handler2 = jest.fn().mockReturnValue(true);

    renderComponent([handler1, handler2]);

    act(() => {
      capturedHandler!('MSG_TYPE');
    });

    expect(handler1).toHaveBeenCalled();
    expect(handler2).toHaveBeenCalled();
  });

  it('logs error when no handler handles the message', () => {
    const handler1 = jest.fn().mockReturnValue(false);
    const handler2 = jest.fn().mockReturnValue(false);

    renderComponent([handler1, handler2]);

    act(() => {
      capturedHandler!('UNKNOWN_TYPE');
    });

    expect(mockLogger.error).toHaveBeenCalledWith(
      'Invalid message type, not handled by any handler, msgKind [UNKNOWN_TYPE]'
    );
  });

  it('does not log error if at least one handler handles the message', () => {
    const handler1 = jest.fn().mockReturnValue(false);
    const handler2 = jest.fn().mockReturnValue(true);

    renderComponent([handler1, handler2]);

    act(() => {
      capturedHandler!('MSG_TYPE');
    });

    expect(mockLogger.error).not.toHaveBeenCalled();
  });

  it('re-subscribes when handlers change', () => {
    const handler1 = jest.fn().mockReturnValue(false);
    const handler2 = jest.fn().mockReturnValue(true);

    const { rerender } = renderComponent([handler1]);

    rerender(
      <AppWebSocketProvider appWebSocketMsgHandlers={[handler2]}>
        <Text>Child</Text>
      </AppWebSocketProvider>
    );

    // Old subscription cleaned up
    expect(mockUnsubscribe).toHaveBeenCalled();

    // New subscription created
    expect(mockSubscribe).toHaveBeenCalledTimes(2);
  });

  it('renders children', () => {
    const { getByTestId } = renderComponent([]);

    expect(getByTestId('child')).toBeTruthy();
  });
});
