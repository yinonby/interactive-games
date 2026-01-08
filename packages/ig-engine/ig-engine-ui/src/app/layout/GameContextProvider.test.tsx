import type { RnuiImageSourceT } from "@ig/rnui";
import { render } from '@testing-library/react-native';
import React from 'react';
import { Text } from 'react-native';
import type { GameImageTypeT } from "../../types/GameImageTypes";
import type { GameUiConfigT, GameUiUrlPathsAdapter } from '../../types/GameUiConfigTypes';
import GameContextProvider, { useGameContext } from './GameContextProvider';

describe('GameContextProvider and useGameContext (React Native)', () => {
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

  it('renders children correctly', () => {
    const { getByTestId } = render(
      <GameContextProvider
        imagesSourceMap={{} as Record<GameImageTypeT, RnuiImageSourceT>}
        gameUiConfig={mockConfig}
        gameUiUrlPathsAdapter={{} as GameUiUrlPathsAdapter}
      >
        <TestChild />
      </GameContextProvider>
    );

    const child = getByTestId('text-tid');
    expect(child.props.children).toBe('Hello');
  });

  it('renders multiple children correctly', () => {
    const { getAllByTestId } = render(
      <GameContextProvider
        imagesSourceMap={{} as Record<GameImageTypeT, RnuiImageSourceT>}
        gameUiConfig={mockConfig}
        gameUiUrlPathsAdapter={{} as GameUiUrlPathsAdapter}
      >
        <TestChild />
        <TestChild />
      </GameContextProvider>
    );

    const children = getAllByTestId('text-tid');
    expect(children).toHaveLength(2);
  });

  it('useGameContext returns the exact config object', () => {
    let contextValue: GameUiConfigT | undefined;

    const TestConsumer: React.FC = () => {
      const { gameUiConfig } = useGameContext();
      contextValue = gameUiConfig;
      return null;
    };

    render(
      <GameContextProvider
        imagesSourceMap={{} as Record<GameImageTypeT, RnuiImageSourceT>}
        gameUiConfig={mockConfig}
        gameUiUrlPathsAdapter={{} as GameUiUrlPathsAdapter}
      >
        <TestConsumer />
      </GameContextProvider>
    );

    expect(contextValue).toBe(mockConfig);
  });
});
