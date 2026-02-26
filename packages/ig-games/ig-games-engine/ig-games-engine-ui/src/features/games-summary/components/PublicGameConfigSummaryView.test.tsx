
import { buildMockedTranslation } from '@ig/app-engine-ui/test-utils';
import { buildPublicGameConfigMock } from '@ig/games-engine-models/test-utils';
import { MIN_TO_MS } from '@ig/utils';
import { render } from '@testing-library/react-native';
import React from 'react';
import { PublicGameConfigSummaryView } from './PublicGameConfigSummaryView';

// mocks

jest.mock('./MinimalPublicGameConfigTableRows', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');

  return {
    MinimalPublicGameConfigTableRows: View,
  };
});

describe('PublicGameConfigSummaryView', () => {
  it('renders correctly', async () => {
    const gameInfo = buildPublicGameConfigMock({
      gameName: 'g1',
      extraTimeLimitDurationInfo: { kind: 'limited', durationMs: MIN_TO_MS(6) },
    })

    const { getByText, getByTestId } = render(
      <PublicGameConfigSummaryView
        gameInfo={gameInfo}
      />
    );

    getByText(gameInfo.gameName);

    const rows = getByTestId('MinimalPublicGameConfigTableRows-tid');
    expect(rows.props.minimalPublicGameConfig).toEqual(gameInfo);

    getByText(buildMockedTranslation('games:extraTimeLimit'));
    getByText(buildMockedTranslation('common:minutes'));
  });

  it('renders correctly, extraTimeLimit is unlimited', async () => {
    const gameInfo = buildPublicGameConfigMock({
      gameName: 'g1',
      extraTimeLimitDurationInfo: { kind: 'unlimited' },
    })

    const { getByText } = render(
      <PublicGameConfigSummaryView
        gameInfo={gameInfo}
      />
    );

    getByText(buildMockedTranslation('common:unlimited'));
  });
});
