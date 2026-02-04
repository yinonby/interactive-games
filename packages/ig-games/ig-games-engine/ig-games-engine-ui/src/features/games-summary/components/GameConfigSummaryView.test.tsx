
import { buildTestGameConfig } from '@ig/games-engine-models/test-utils';
import { MIN_TO_MS } from '@ig/utils';
import { render } from '@testing-library/react-native';
import React from 'react';
import { buildMockedTranslation } from '../../../../test/mocks/EngineAppUiMocks';
import { GameConfigSummaryView } from './GameConfigSummaryView';

// mocks

jest.mock('./MinimalGameConfigTableRows', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');

  return {
    MinimalGameConfigTableRows: View,
  };
});

describe('GameConfigSummaryView', () => {
  it('renders correctly', async () => {
    const gameConfig = buildTestGameConfig({
      gameName: 'g1',
      extraTimeLimitDurationInfo: { kind: 'limited', durationMs: MIN_TO_MS(6) },
    })

    const { getByText, getByTestId } = render(
      <GameConfigSummaryView
        gameConfig={gameConfig}
      />
    );

    getByText(gameConfig.gameName);

    const rows = getByTestId('MinimalGameConfigTableRows-tid');
    expect(rows.props.minimalGameConfig).toEqual(gameConfig);

    getByText(buildMockedTranslation('games:extraTimeLimit'));
    getByText(buildMockedTranslation('common:minutes'));
  });

  it('renders correctly, extraTimeLimit is unlimited', async () => {
    const gameConfig = buildTestGameConfig({
      gameName: 'g1',
      extraTimeLimitDurationInfo: { kind: 'unlimited' },
    })

    const { getByText } = render(
      <GameConfigSummaryView
        gameConfig={gameConfig}
      />
    );

    getByText(buildMockedTranslation('common:unlimited'));
  });
});
