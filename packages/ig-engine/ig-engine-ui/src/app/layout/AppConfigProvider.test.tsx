
import type { AppImageAssetT } from '@ig/engine-models';
import type { RnuiImageSourceT } from "@ig/rnui";
import { render } from '@testing-library/react-native';
import React from 'react';
import { Text } from 'react-native';
import type { GameUiConfigT, GamesUiUrlPathsAdapter } from '../../types/GameUiConfigTypes';
import { AppConfigProvider, useAppConfig } from './AppConfigProvider';

describe('AppConfigProvider and useAppConfig (React Native)', () => {
  const mockConfig: GameUiConfigT = {
    apiUrl: 'https://api.fake-url.com',
    wssUrl: 'https://wss.fake-url.com',
    appUrl: 'https://app.fake-url.com',
    isTesting: true,
    isDevel: false,
  };

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
});
