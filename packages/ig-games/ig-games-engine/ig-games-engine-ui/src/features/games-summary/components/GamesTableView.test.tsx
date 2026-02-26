
import { buildMockedTranslation } from '@ig/app-engine-ui/test-utils';
import type { PublicGameConfigT } from '@ig/games-engine-models';
import { buildPublicGameConfigMock } from '@ig/games-engine-models/test-utils';
import { render } from '@testing-library/react-native';
import React from 'react';
import { GamesTableView } from './GamesTableView';

// --------------------
// Mocks
// --------------------

jest.mock('./GamesTableRow', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');

  return {
    GamesTableRow: View
  };
});

// --------------------
// Tests
// --------------------

describe('GamesTableView', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders empty table', () => {
    const joinedPublicGameConfigs: PublicGameConfigT[] = [];
    const { getAllByTestId, getByTestId, queryByTestId, getByText } = render(
      <GamesTableView joinedPublicGameConfigs={joinedPublicGameConfigs} />
    );

    getByTestId('RnuiTable-tid');
    getByTestId('RnuiTableHeader-tid');

    expect(getAllByTestId('RnuiTableTitle-tid')).toHaveLength(2);
    getByText(buildMockedTranslation("games:gameName"));

    expect(queryByTestId('GamesTableRow-tid')).toBeNull();
  });

  it('renders games list when games exist', () => {
    const joinedPublicGameConfigs: PublicGameConfigT[] = [
      buildPublicGameConfigMock({ gameName: "game-1" }),
      buildPublicGameConfigMock({ gameName: "game-2" }),
    ];

    const { getAllByTestId, getByTestId } = render(
      <GamesTableView joinedPublicGameConfigs={joinedPublicGameConfigs} />
    );

    getByTestId('RnuiTable-tid');
    getByTestId('RnuiTableHeader-tid');
    expect(getAllByTestId('RnuiTableTitle-tid')).toHaveLength(2);
    expect(getAllByTestId('GamesTableRow-tid')).toHaveLength(2);
  });
});
