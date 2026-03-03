
import type { PublicGameConfigT } from '@ig/games-engine-models';
import { buildPublicGameConfigMock } from '@ig/games-engine-models/test-utils';
import { render } from '@testing-library/react-native';
import React from 'react';
import { GameConfigCardView } from './GameConfigCardView';

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

jest.mock('../../games-summary/components/PublicGameConfigSummaryView', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');

  return {
    PublicGameConfigSummaryView: View,
  };
});

// tests

describe('GameConfigCardView', () => {
  it('renders properly', async () => {
    const publicGameConfig: PublicGameConfigT = buildPublicGameConfigMock({});

    const { getByTestId } = render(
      <GameConfigCardView publicGameConfig={publicGameConfig} />
    );

    getByTestId('GameImageCard-tid');
    getByTestId('PublicGameConfigSummaryView-tid');
    getByTestId('CreateGameInstanceButton-tid');
  });
});
