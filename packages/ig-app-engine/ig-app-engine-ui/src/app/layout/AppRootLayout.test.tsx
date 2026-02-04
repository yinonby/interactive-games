
import type { RnuiImageSourceT, RnuiStylesT } from '@ig/rnui';
import { render } from '@testing-library/react-native';
import React, { type ReactNode } from 'react';
import { Text } from 'react-native';
import type { MD3Theme } from 'react-native-paper';
import type { AppImageAssetT } from '../../../../ig-app-engine-models';
import type { GameUiConfigT, GamesUiUrlPathsAdapter } from '../../types/GameUiConfigTypes';
import { AppRootLayout } from './AppRootLayout'; // adjust path if needed

jest.mock('react-redux', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const React = require('react');
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');

  return {
    Provider: ({ children }: { children: React.ReactNode }) => (
      <View testID='reactReduxMock-tid'>{children}</View>
    ),
  };
});

jest.mock('../model/reducers/AppReduxStore', () => {
  return {
    createReduxStore: () => null,
  };
});

jest.mock('./AppWebSocketProvider', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');

  return {
    AppWebSocketProvider: View,
  };
});

jest.mock('../localization/AppLocalizationProvider', () => {
  return {
    AppLocalizationProvider: ({ children }: { children: ReactNode }) => children,
  };
});

jest.mock('../error-handling/AppErrorHandlingProvider', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');

  return {
    AppErrorHandlingProvider: View,
  };
});

jest.mock('./AppConfigProvider', () => {
  return {
    AppConfigProvider: ({ children }: { children: ReactNode }) => children,
  };
});

describe('AppRootLayout', () => {
  it('renders correctly', () => {
    const { getByText, getByTestId } = render(
      <AppRootLayout
        imagesSourceMap={{} as Record<AppImageAssetT, RnuiImageSourceT>}
        theme={{} as MD3Theme}
        rnuiStyles={{} as RnuiStylesT}
        gameUiConfig={{} as GameUiConfigT}
        gamesUiUrlPathsAdapter={{} as GamesUiUrlPathsAdapter}
        appWebSocketMsgHandlers={[]}
      >
        <Text>Test Child</Text>
      </AppRootLayout>
    );

    // verify all providers are rendered
    getByTestId('reactReduxMock-tid');
    getByTestId('AppErrorHandlingProvider-tid');
    getByTestId('gameLayoutWrapper-tid');

    // Check that the child text is rendered
    getByText('Test Child');
  });
});
