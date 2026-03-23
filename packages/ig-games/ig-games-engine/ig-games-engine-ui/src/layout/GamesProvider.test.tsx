
import { cleanup, render } from '@testing-library/react-native';
import React from 'react';
import { Text } from 'react-native';
import { GamesProvider } from './GamesProvider';

// Mocks
const mockSubscribe = jest.fn();
const mockUnsubscribe = jest.fn();
let mockAuthId = 'user-1';

jest.mock('@ig/app-engine-ui', () => ({
  useWebsocketTopicSubscriptionProvider: () => ({
    topicSubscribe: mockSubscribe,
    topicUnsubscribe: mockUnsubscribe,
  }),
}));

jest.mock('@ig/auth-ui', () => ({
  useAuth: () => ({
    curAuthId: mockAuthId,
  }),
}));

describe('GamesProvider (React Native)', () => {
  const renderComponent = () =>
    render(
      <GamesProvider gameInstanceUpdateNotificationTopicPrefix="game-topic-">
        <Text testID="child">Child</Text>
      </GamesProvider>
    );

  beforeEach(() => {
    jest.clearAllMocks();
    mockAuthId = 'user-1';
  });

  afterEach(() => {
    cleanup();
  });

  it('subscribes on mount with correct topic', () => {
    renderComponent();

    expect(mockSubscribe).toHaveBeenCalledTimes(1);
    expect(mockSubscribe).toHaveBeenCalledWith('game-topic-user-1');
  });

  it('unsubscribes on unmount with correct topic', () => {
    const { unmount } = renderComponent();

    unmount();

    expect(mockUnsubscribe).toHaveBeenCalledTimes(1);
    expect(mockUnsubscribe).toHaveBeenCalledWith('game-topic-user-1');
  });

  it('re-subscribes when curAuthId changes', () => {
    const { rerender } = renderComponent();

    // Change auth ID
    mockAuthId = 'user-2';

    rerender(
      <GamesProvider gameInstanceUpdateNotificationTopicPrefix="game-topic-">
        <Text>Child</Text>
      </GamesProvider>
    );

    // Cleanup old subscription
    expect(mockUnsubscribe).toHaveBeenCalledWith('game-topic-user-1');

    // New subscription
    expect(mockSubscribe).toHaveBeenCalledWith('game-topic-user-2');
  });

  it('renders children correctly', () => {
    const { getByTestId } = renderComponent();

    expect(getByTestId('child')).toBeTruthy();
  });
});
