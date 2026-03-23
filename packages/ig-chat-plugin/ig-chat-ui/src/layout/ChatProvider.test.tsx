
import { render } from '@testing-library/react-native';
import React from 'react';
import { Text } from 'react-native';
import { ChatProvider, useChat } from './ChatProvider';

// Test component to consume the hook
const TestConsumer = () => {
  const { chatUpdateNotificationTopicPrefix } = useChat();

  return (
    <Text testID="prefix">
      {chatUpdateNotificationTopicPrefix}
    </Text>
  );
};

describe('ChatProvider (React Native)', () => {
  it('provides the correct context value to children', () => {
    const { getByTestId } = render(
      <ChatProvider chatUpdateNotificationTopicPrefix="chat-prefix-">
        <TestConsumer />
      </ChatProvider>
    );

    expect(getByTestId('prefix').props.children).toBe('chat-prefix-');
  });

  it('updates value when prop changes', () => {
    const { getByTestId, rerender } = render(
      <ChatProvider chatUpdateNotificationTopicPrefix="prefix-1">
        <TestConsumer />
      </ChatProvider>
    );

    expect(getByTestId('prefix').props.children).toBe('prefix-1');

    rerender(
      <ChatProvider chatUpdateNotificationTopicPrefix="prefix-2">
        <TestConsumer />
      </ChatProvider>
    );

    expect(getByTestId('prefix').props.children).toBe('prefix-2');
  });

  it('renders children properly', () => {
    const { getByTestId } = render(
      <ChatProvider chatUpdateNotificationTopicPrefix="chat-prefix-">
        <Text testID="child">Child</Text>
      </ChatProvider>
    );

    expect(getByTestId('child')).toBeTruthy();
  });

  it('throws or returns undefined behavior when used outside provider', () => {
    // Since your hook casts (as ChatContextT), it won't throw automatically,
    // but will return undefined and likely crash on destructuring.
    const BrokenConsumer = () => {
      const { chatUpdateNotificationTopicPrefix } = useChat();
      return <Text>{chatUpdateNotificationTopicPrefix}</Text>;
    };

    expect(() => render(<BrokenConsumer />)).toThrow();
  });
});
