
import { render } from '@testing-library/react-native';
import React from 'react';
import type { AddGameViewPropsT } from './AddGameView';
import type { AvailableGamesViewPropsT } from './AvailableGamesView';
import { GamesDashboardView } from './GamesDashboardView';
import type { GamesSummaryViewPropsT } from './GamesSummaryView';

jest.mock('./GamesSummaryView', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');

  return {
    GamesSummaryView: (props: GamesSummaryViewPropsT) => <View testID="GamesSummaryView-tid" {...props} />
  };
});

jest.mock('./AddGameView', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');

  return {
    AddGameView: (props: AddGameViewPropsT) => <View testID="AddGameView-tid" {...props} />
  };
});

jest.mock('./AvailableGamesView', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');

  return {
    AvailableGamesView: (props: AvailableGamesViewPropsT) => (
      <View testID="AvailableGamesView-tid" {...props} />
    ),
  };
});

describe('GamesDashboardView', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(<GamesDashboardView />);

    expect(getByTestId('GamesSummaryView-tid')).toBeTruthy();
    expect(getByTestId('AddGameView-tid')).toBeTruthy();
    expect(getByTestId('AvailableGamesView-tid')).toBeTruthy();
  });
});
