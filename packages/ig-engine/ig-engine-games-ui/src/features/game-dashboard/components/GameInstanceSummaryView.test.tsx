
import type { MinimalGameInstanceExposedInfoT } from '@ig/engine-models';
import { buildTestMinimalGameInstanceExposedInfo } from '@ig/engine-models/test-utils';
import { render } from '@testing-library/react-native';
import React from 'react';
import { GameInstanceSummaryView } from './GameInstanceSummaryView';

// mocks

jest.mock('../../game-instance/common/GameStatusView', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');

  return {
    GameStatusView: View,
  };
});

jest.mock('../../game-instance/dashboard/components/PlayersTableView', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');

  return {
    PlayersTableView: View,
  };
});

// tests

describe('GameInstanceSummaryView', () => {
  it('renders properly', async () => {
    const minimalGameInstanceExposedInfo: MinimalGameInstanceExposedInfoT = buildTestMinimalGameInstanceExposedInfo({
      gameInstanceId: 'ABC',
    });

    const { getByTestId } = render(
      <GameInstanceSummaryView minimalGameInstanceExposedInfo={minimalGameInstanceExposedInfo} />
    );

    getByTestId('GameStatusView-tid');
    getByTestId('PlayersTableView-tid');
  });
});
