
import type { RnuiImageSourceT, RnuiStylesT } from "@ig/rnui";
import { render } from '@testing-library/react-native';
import React, { type ReactNode } from 'react';
import { Text } from 'react-native';
import type { MD3Theme } from "react-native-paper";
import type { GameImageTypeT } from "../../types/GameImageTypes";
import type { GameUiConfigT, GamesUiUrlPathsAdapter } from "../../types/GameUiConfigTypes";
import { AppRootLayout } from './AppRootLayout'; // adjust path if needed

jest.mock('react-redux', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const React = require('react');
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');

  return {
    Provider: ({ children }: { children: React.ReactNode }) => (
      <View testID="reactReduxMock-tid">{children}</View>
    ),
  };
});

jest.mock("../model/reducers/AppReduxStore", () => {
  return {
    createReduxStore: () => null,
  };
});

jest.mock("./AppWebSocketProvider", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');

  return {
    AppWebSocketProvider: View,
  };
});

jest.mock("../localization/AppLocalizationProvider", () => {
  return {
    AppLocalizationProvider: ({ children }: { children: ReactNode }) => children,
  };
});

jest.mock("../error-handling/AppErrorHandlingProvider", () => {
  return {
    AppErrorHandlingProvider: ({ children }: { children: ReactNode }) => children,
  };
});

describe('AppRootLayout', () => {
  it('renders children correctly', () => {
    const { getByText } = render(
      <AppRootLayout
        imagesSourceMap={{} as Record<GameImageTypeT, RnuiImageSourceT>}
        theme={{} as MD3Theme}
        rnuiStyles={{} as RnuiStylesT}
        gameUiConfig={{} as GameUiConfigT}
        gamesUiUrlPathsAdapter={{} as GamesUiUrlPathsAdapter}
        appWebSocketMsgHandlers={[]}
      >
        <Text>Test Child</Text>
      </AppRootLayout>
    );

    // Check that the child text is rendered
    expect(getByText('Test Child')).toBeTruthy();
  });

  it('renders wrappers', () => {
    const { getByTestId } = render(
      <AppRootLayout
        imagesSourceMap={{} as Record<GameImageTypeT, RnuiImageSourceT>}
        theme={{} as MD3Theme}
        rnuiStyles={{} as RnuiStylesT}
        gameUiConfig={{} as GameUiConfigT}
        gamesUiUrlPathsAdapter={{} as GamesUiUrlPathsAdapter}
        appWebSocketMsgHandlers={[]}
      >
        <Text>Child</Text>
      </AppRootLayout>
    );

    expect(getByTestId('reactReduxMock-tid')).toBeTruthy();
    expect(getByTestId('gameLayoutWrapper-tid')).toBeTruthy();
  });
});
