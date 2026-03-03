
import { render } from '@testing-library/react-native';
import React from 'react';
import { GameDashboardViewPageContent } from './GameDashboardViewPageContent';

// mocks
jest.mock("../components/GameDashboardView", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');

  return {
    GameDashboardView: View,
  };
});

describe("GameDashboardViewPageContent", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByTestId } = render(
      <GameDashboardViewPageContent gameConfigId='GID1'/>
    );

    getByTestId("RnuiAppContent-tid");
    getByTestId("GameDashboardView-tid");
  });
});
