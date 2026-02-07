
import type { GameInfoT } from '@ig/games-engine-models';
import { buildTestGameInfo } from '@ig/games-engine-models/test-utils';
import { render } from '@testing-library/react-native';
import React from 'react';
import { GameInfoCardView } from './GameInfoCardView';

// mocks

jest.mock('../../common/game-info/GameImageCard', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');

  return {
    GameImageCard: View,
  };
});

jest.mock('./CreateGameInstanceButton', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');

  return {
    CreateGameInstanceButton: View,
  };
});

jest.mock('../../games-summary/components/GameInfoSummaryView', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');

  return {
    GameInfoSummaryView: View,
  };
});

// tests

describe('GameInfoCardView', () => {
  it('renders properly', async () => {
    const gameInfo: GameInfoT = buildTestGameInfo({});

    const { getByTestId } = render(
      <GameInfoCardView gameInfo={gameInfo} />
    );

    getByTestId('GameImageCard-tid');
    getByTestId('GameInfoSummaryView-tid');
    getByTestId('CreateGameInstanceButton-tid');
  });
});
