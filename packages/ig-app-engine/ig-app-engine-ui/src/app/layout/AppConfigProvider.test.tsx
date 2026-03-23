
import type { WebsocketTopicSubscriptionProvider } from '@/types/WebsocketServerTypes';
import type { WebsocketAdapter } from '@ig/client-utils';
import type { RnuiImageSourceT } from '@ig/rnui';
import { render } from '@testing-library/react-native';
import React from 'react';
import { Text } from 'react-native';
import type { AppImageAssetT } from '../../../../ig-app-engine-models';
import type { GameUiConfigT, GamesUiUrlPathsAdapter } from '../../types/GameUiConfigTypes';
import { useWsClient } from '../providers/useWsClient';
import {
  AppConfigProvider, useAppConfig, useAppWsClient,
  useWebsocketTopicSubscriptionProvider
} from './AppConfigProvider';

// mocks

jest.mock('../providers/useWsClient', () => ({
  useWsClient: jest.fn(),
}));

// tests

describe('AppConfigProvider and useAppConfig (React Native)', () => {
  const mockConfig: GameUiConfigT = {
    apiUrl: 'https://api.fake-url.com',
    wssUrl: 'https://wss.fake-url.com',
    appUrl: 'https://app.fake-url.com',
    isTesting: true,
    isDevel: false,
  };

  const mock_useWsClient = useWsClient as jest.Mock;
  const mock_connect = jest.fn();
  const mock_disconnect = jest.fn();
  const mock_subscribe = jest.fn();
  const mock_send = jest.fn();
  mock_useWsClient.mockReturnValue({
    connect: mock_connect,
    disconnect: mock_disconnect,
    subscribe: mock_subscribe,
    send: mock_send,
  });

  const TestChild: React.FC = () => {
    return (
      <Text testID="text-tid">
        Hello
      </Text>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', async () => {
    const { getByTestId } = render(
      <AppConfigProvider
        imagesSourceMap={{} as Record<AppImageAssetT, RnuiImageSourceT>}
        gameUiConfig={mockConfig}
        gamesUiUrlPathsAdapter={{} as GamesUiUrlPathsAdapter}
      >
        <TestChild />
      </AppConfigProvider>
    );

    // verify components
    const child = getByTestId('text-tid');
    expect(child.props.children).toBe('Hello');
  });

  it('renders multiple children correctly', async () => {
    const { getAllByTestId } = render(
      <AppConfigProvider
        imagesSourceMap={{} as Record<AppImageAssetT, RnuiImageSourceT>}
        gameUiConfig={mockConfig}
        gamesUiUrlPathsAdapter={{} as GamesUiUrlPathsAdapter}
      >
        <TestChild />
        <TestChild />
      </AppConfigProvider>
    );

    const children = getAllByTestId('text-tid');
    expect(children).toHaveLength(2);
  });

  it('useAppConfig returns the exact config object', async () => {
    let contextValue: GameUiConfigT | undefined;

    const TestConsumer: React.FC = () => {
      const { gameUiConfig } = useAppConfig();
      contextValue = gameUiConfig;
      return null;
    };

    render(
      <AppConfigProvider
        imagesSourceMap={{} as Record<AppImageAssetT, RnuiImageSourceT>}
        gameUiConfig={mockConfig}
        gamesUiUrlPathsAdapter={{} as GamesUiUrlPathsAdapter}
      >
        <TestConsumer />
      </AppConfigProvider>
    );

    expect(contextValue).toBe(mockConfig);
  });

  it('useAppWsClient returns the exact config object', async () => {
    let contextValue: { wsClient: WebsocketAdapter } | undefined;

    const TestConsumer: React.FC = () => {
      const _context = useAppWsClient();
      contextValue = _context;
      return null;
    };

    render(
      <AppConfigProvider
        imagesSourceMap={{} as Record<AppImageAssetT, RnuiImageSourceT>}
        gameUiConfig={mockConfig}
        gamesUiUrlPathsAdapter={{} as GamesUiUrlPathsAdapter}
      >
        <TestConsumer />
      </AppConfigProvider>
    );

    expect(contextValue).toBeTruthy();
  });

  it('useWebsocketTopicSubscriptionProvider returns the exact config object', async () => {
    let contextValue: WebsocketTopicSubscriptionProvider | undefined;

    const TestConsumer: React.FC = () => {
      const _context = useWebsocketTopicSubscriptionProvider();
      contextValue = _context;
      return null;
    };

    render(
      <AppConfigProvider
        imagesSourceMap={{} as Record<AppImageAssetT, RnuiImageSourceT>}
        gameUiConfig={mockConfig}
        gamesUiUrlPathsAdapter={{} as GamesUiUrlPathsAdapter}
      >
        <TestConsumer />
      </AppConfigProvider>
    );

    expect(contextValue).toBeTruthy();

    contextValue!.topicSubscribe('ABC');
    expect(mock_send).toHaveBeenCalledWith({ action: 'subscribe', topic: 'ABC' });

    contextValue!.topicUnsubscribe('ABC');
    expect(mock_send).toHaveBeenCalledWith({ action: 'unsubscribe', topic: 'ABC' });
  });
});
