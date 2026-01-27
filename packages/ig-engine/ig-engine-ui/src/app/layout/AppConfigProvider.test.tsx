
import type { AppImageAssetT } from '@ig/engine-models';
import type { RnuiImageSourceT } from "@ig/rnui";
import { render, waitFor } from '@testing-library/react-native';
import React from 'react';
import { Text } from 'react-native';
import type { GameUiConfigT, GamesUiUrlPathsAdapter } from '../../types/GameUiConfigTypes';
import { AppConfigProvider, useAppConfig } from './AppConfigProvider';
import * as AppConfigUtils from './AppConfigUtils';

jest.mock('@ig/lib', () => ({
  generateUuidv4: jest.fn(() => 'newUserId'),
}));

jest.mock('./AppConfigUtils', () => ({
  getLocalUserId: jest.fn(),
  setLocalUserId: jest.fn(),
}));

describe('AppConfigProvider and useAppConfig (React Native)', () => {
  const getLocalUserIdSpy = jest.spyOn(AppConfigUtils, 'getLocalUserId');
  const setLocalUserIdSpy = jest.spyOn(AppConfigUtils, 'setLocalUserId');

  // mock generateUuidv4
  const existingUserId = 'existingUserId';
  const newUserId = 'newUserId';

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

  it('renders activity indicator', async () => {
    const { getByTestId, queryByTestId } = render(
      <AppConfigProvider
        imagesSourceMap={{} as Record<AppImageAssetT, RnuiImageSourceT>}
        gameUiConfig={mockConfig}
        gamesUiUrlPathsAdapter={{} as GamesUiUrlPathsAdapter}
      >
        <TestChild />
      </AppConfigProvider>
    );

    getByTestId('RnuiActivityIndicator-tid');

    await waitFor(() =>
      expect(getLocalUserIdSpy).toHaveBeenCalled()
    );

    expect(queryByTestId('RnuiActivityIndicator-tid')).toBeNull();
  });

  it('creates new local user id', async () => {
    getLocalUserIdSpy.mockResolvedValue(null);

    render(
      <AppConfigProvider
        imagesSourceMap={{} as Record<AppImageAssetT, RnuiImageSourceT>}
        gameUiConfig={mockConfig}
        gamesUiUrlPathsAdapter={{} as GamesUiUrlPathsAdapter}
      >
        <TestChild />
      </AppConfigProvider>
    );

    await waitFor(() =>
      expect(getLocalUserIdSpy).toHaveBeenCalled()
    );

    // verify calls
    expect(setLocalUserIdSpy).toHaveBeenCalledWith(newUserId);
  });

  it('uses existing local user id', async () => {
    getLocalUserIdSpy.mockResolvedValue(existingUserId);

    render(
      <AppConfigProvider
        imagesSourceMap={{} as Record<AppImageAssetT, RnuiImageSourceT>}
        gameUiConfig={mockConfig}
        gamesUiUrlPathsAdapter={{} as GamesUiUrlPathsAdapter}
      >
        <TestChild />
      </AppConfigProvider>
    );

    await waitFor(() =>
      expect(getLocalUserIdSpy).toHaveBeenCalled()
    );

    // verify calls
    expect(setLocalUserIdSpy).not.toHaveBeenCalled();
  });

  it('renders correctly', async () => {
    getLocalUserIdSpy.mockResolvedValue(null);

    const { getByTestId, queryByTestId } = render(
      <AppConfigProvider
        imagesSourceMap={{} as Record<AppImageAssetT, RnuiImageSourceT>}
        gameUiConfig={mockConfig}
        gamesUiUrlPathsAdapter={{} as GamesUiUrlPathsAdapter}
      >
        <TestChild />
      </AppConfigProvider>
    );

    await waitFor(() =>
      expect(getLocalUserIdSpy).toHaveBeenCalled()
    );

    // verify components
    expect(queryByTestId('RnuiActivityIndicator-tid')).toBeNull();

    const child = getByTestId('text-tid');
    expect(child.props.children).toBe('Hello');
  });

  it('renders multiple children correctly', async () => {
    getLocalUserIdSpy.mockResolvedValue(null);

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

    await waitFor(() =>
      expect(getLocalUserIdSpy).toHaveBeenCalled()
    );

    const children = getAllByTestId('text-tid');
    expect(children).toHaveLength(2);
  });

  it('useAppConfig returns the exact config object', async () => {
    getLocalUserIdSpy.mockResolvedValue(null);

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

    await waitFor(() =>
      expect(getLocalUserIdSpy).toHaveBeenCalled()
    );

    expect(contextValue).toBe(mockConfig);
  });
});
