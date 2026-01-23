
import type { GameConfigT } from '@ig/engine-models';
import { buildTestGameConfig } from '@ig/engine-models/test-utils';
import { render } from '@testing-library/react-native';
import React from 'react';
import { GameConfigCardView } from './GameConfigCardView';

// mocks

jest.mock('../../common/game-config/GameImageCard', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');

  return {
    GameImageCard: View,
  };
});

jest.mock('./AddGameInstanceButton', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');

  return {
    AddGameInstanceButton: View,
  };
});

jest.mock('../../games-summary/components/GameConfigSummaryView', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');

  return {
    GameConfigSummaryView: View,
  };
});

// tests

describe('GameConfigCardView', () => {
  it('renders properly', async () => {
    const gameConfig: GameConfigT = buildTestGameConfig({});

    const { getByTestId } = render(
      <GameConfigCardView gameConfig={gameConfig} />
    );

    getByTestId('GameImageCard-tid');
    getByTestId('GameConfigSummaryView-tid');
    getByTestId('AddGameInstanceButton-tid');
  });
});
