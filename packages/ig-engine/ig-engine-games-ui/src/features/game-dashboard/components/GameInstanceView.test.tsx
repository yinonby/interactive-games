
import type { MinimalGameInstanceExposedInfoT } from '@ig/engine-models';
import { buildTestMinimalGameInstanceExposedInfo } from '@ig/engine-models/test-utils';
import { render } from '@testing-library/react-native';
import React from 'react';
import { GameInstanceView } from './GameInstanceView';

// mocks

jest.mock('./GameInstanceSummaryView', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');

  return {
    GameInstanceSummaryView: View,
  };
});

jest.mock('./OpenGameInstanceButtonLink', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');

  return {
    OpenGameInstanceButtonLink: View,
  };
});

// tests

describe('GameInstanceView', () => {
  it('renders properly', async () => {
    const minimalGameInstanceExposedInfo: MinimalGameInstanceExposedInfoT = buildTestMinimalGameInstanceExposedInfo({
      gameInstanceId: 'ABC',
    });

    const { getByTestId } = render(
      <GameInstanceView minimalGameInstanceExposedInfo={minimalGameInstanceExposedInfo} />
    );

    getByTestId('GameInstanceSummaryView-tid');
    getByTestId('OpenGameInstanceButtonLink-tid');
  });
});
