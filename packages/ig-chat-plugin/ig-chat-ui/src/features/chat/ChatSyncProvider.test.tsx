import { cleanup, render } from '@testing-library/react-native';
import React from 'react';
import { Text } from 'react-native';
import { ChatSyncProvider } from './ChatSyncProvider';

// Mocks
const mockSubscribe = jest.fn();
const mockUnsubscribe = jest.fn();

jest.mock('@ig/app-engine-ui', () => ({
  useWebsocketTopicSubscriptionProvider: () => ({
    topicSubscribe: mockSubscribe,
    topicUnsubscribe: mockUnsubscribe,
  }),
}));

jest.mock('../../layout/ChatProvider', () => ({
  useChat: () => ({
    chatUpdateNotificationTopicPrefix: 'chat-topic-',
  }),
}));

describe('ChatSyncProvider (React Native)', () => {
  const renderComponent = (conversationId: string) =>
    render(
      <ChatSyncProvider conversationId={conversationId}>
        <Text testID="child">Child</Text>
      </ChatSyncProvider>
    );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('subscribes on mount with correct topic', () => {
    renderComponent('123');

    expect(mockSubscribe).toHaveBeenCalledTimes(1);
    expect(mockSubscribe).toHaveBeenCalledWith('chat-topic-123');
  });

  it('unsubscribes on unmount with correct topic', () => {
    const { unmount } = renderComponent('123');

    unmount();

    expect(mockUnsubscribe).toHaveBeenCalledTimes(1);
    expect(mockUnsubscribe).toHaveBeenCalledWith('chat-topic-123');
  });

  it('re-subscribes when conversationId changes', () => {
    const { rerender } = renderComponent('123');

    rerender(
      <ChatSyncProvider conversationId="456">
        <Text>Child</Text>
      </ChatSyncProvider>
    );

    // Cleanup of previous effect
    expect(mockUnsubscribe).toHaveBeenCalledWith('chat-topic-123');

    // New subscription
    expect(mockSubscribe).toHaveBeenCalledWith('chat-topic-456');
  });

  it('renders children correctly', () => {
    const { getByTestId } = renderComponent('123');

    expect(getByTestId('child')).toBeTruthy();
  });
});
