
import type { RnuiImageSourceT, RnuiStylesT } from "@ig/rnui";
import { render } from '@testing-library/react-native';
import React from 'react';
import { Text } from 'react-native';
import type { MD3Theme } from "react-native-paper";
import type { GameImageTypeT } from "../../types/GameImageTypes";
import type { GameUiConfigT, GameUiUrlPathsAdapter } from "../../types/GameUiConfigTypes";
import { GameLayout } from './GameLayout'; // adjust path if needed

jest.mock('react-redux', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const React = require('react');
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');

  return {
    Provider: ({ children }: { children: React.ReactNode }) => (
      <View testID="react-redux-mock">{children}</View>
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
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');

  return {
    AppLocalizationProvider: View,
  };
});

describe('GameLayout', () => {
  it('renders children correctly', () => {
    const { getByText } = render(
      <GameLayout
        imagesSourceMap={{} as Record<GameImageTypeT, RnuiImageSourceT>}
        theme={{} as MD3Theme}
        rnuiStyles={{} as RnuiStylesT}
        gameUiConfig={{} as GameUiConfigT}
        gameUiUrlPathsAdapter={{} as GameUiUrlPathsAdapter}
      >
        <Text>Test Child</Text>
      </GameLayout>
    );

    // Check that the child text is rendered
    expect(getByText('Test Child')).toBeTruthy();
  });

  it('renders wrappers', () => {
    const { getByTestId } = render(
      <GameLayout
        imagesSourceMap={{} as Record<GameImageTypeT, RnuiImageSourceT>}
        theme={{} as MD3Theme}
        rnuiStyles={{} as RnuiStylesT}
        gameUiConfig={{} as GameUiConfigT}
        gameUiUrlPathsAdapter={{} as GameUiUrlPathsAdapter}
      >
        <Text>Child</Text>
      </GameLayout>
    );

    expect(getByTestId('react-redux-mock')).toBeTruthy();
    expect(getByTestId('game-layout-wrapper')).toBeTruthy();
  });
});
