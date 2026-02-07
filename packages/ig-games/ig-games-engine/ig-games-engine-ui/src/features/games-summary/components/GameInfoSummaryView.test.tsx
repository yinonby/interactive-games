
import { buildTestGameInfo } from '@ig/games-engine-models/test-utils';
import { MIN_TO_MS } from '@ig/utils';
import { render } from '@testing-library/react-native';
import React from 'react';
import { buildMockedTranslation } from '../../../../test/mocks/EngineAppUiMocks';
import { GameInfoSummaryView } from './GameInfoSummaryView';

// mocks

jest.mock('./MinimalGameInfoTableRows', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');

  return {
    MinimalGameInfoTableRows: View,
  };
});

describe('GameInfoSummaryView', () => {
  it('renders correctly', async () => {
    const gameInfo = buildTestGameInfo({
      gameName: 'g1',
      extraTimeLimitDurationInfo: { kind: 'limited', durationMs: MIN_TO_MS(6) },
    })

    const { getByText, getByTestId } = render(
      <GameInfoSummaryView
        gameInfo={gameInfo}
      />
    );

    getByText(gameInfo.gameName);

    const rows = getByTestId('MinimalGameInfoTableRows-tid');
    expect(rows.props.minimalGameInfo).toEqual(gameInfo);

    getByText(buildMockedTranslation('games:extraTimeLimit'));
    getByText(buildMockedTranslation('common:minutes'));
  });

  it('renders correctly, extraTimeLimit is unlimited', async () => {
    const gameInfo = buildTestGameInfo({
      gameName: 'g1',
      extraTimeLimitDurationInfo: { kind: 'unlimited' },
    })

    const { getByText } = render(
      <GameInfoSummaryView
        gameInfo={gameInfo}
      />
    );

    getByText(buildMockedTranslation('common:unlimited'));
  });
});
