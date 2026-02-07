
import type { GameInfoT } from '@ig/games-engine-models';
import { buildTestGameInfo } from '@ig/games-engine-models/test-utils';
import { render } from '@testing-library/react-native';
import React from 'react';
import { buildMockedTranslation } from '../../../../test/mocks/EngineAppUiMocks';
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
    const joinedGameInfos: GameInfoT[] = [];
    const { getAllByTestId, getByTestId, queryByTestId, getByText } = render(
      <GamesTableView joinedGameInfos={joinedGameInfos} />
    );

    getByTestId('RnuiTable-tid');
    getByTestId('RnuiTableHeader-tid');

    expect(getAllByTestId('RnuiTableTitle-tid')).toHaveLength(2);
    getByText(buildMockedTranslation("games:gameName"));

    expect(queryByTestId('GamesTableRow-tid')).toBeNull();
  });

  it('renders games list when games exist', () => {
    const joinedGameInfos: GameInfoT[] = [
      buildTestGameInfo({ gameName: "game-1" }),
      buildTestGameInfo({ gameName: "game-2" }),
    ];

    const { getAllByTestId, getByTestId } = render(
      <GamesTableView joinedGameInfos={joinedGameInfos} />
    );

    getByTestId('RnuiTable-tid');
    getByTestId('RnuiTableHeader-tid');
    expect(getAllByTestId('RnuiTableTitle-tid')).toHaveLength(2);
    expect(getAllByTestId('GamesTableRow-tid')).toHaveLength(2);
  });
});
