
import type { MinimalGameInstanceExposedInfoT } from "@ig/engine-models";
import { buildTestMinimalGameConfig, buildTestMinimalGameInstanceExposedInfo } from '@ig/engine-models/test-utils';
import { render } from '@testing-library/react-native';
import React from 'react';
import { buildMockedTranslation } from "../../../../test/mocks/EngineAppUiMocks";
import type { GamesTableRowPropsT } from "./GamesTableRow";
import { GamesTableView } from './GamesTableView';

// --------------------
// Mocks
// --------------------

jest.mock('./GamesTableRow', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');

  return {
    GamesTableRow: (props: GamesTableRowPropsT) => <View testID="games-table-row-tid"  {...props} />
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
    const minimalGameInstanceExposedInfos: MinimalGameInstanceExposedInfoT[] = [];
    const { getAllByTestId, getByTestId, queryByTestId, getByText } = render(
      <GamesTableView minimalGameInstanceExposedInfos={minimalGameInstanceExposedInfos} />
    );

    getByTestId('game-table-tid');
    getByTestId('game-table-header-tid');

    expect(getAllByTestId('game-table-title-tid')).toHaveLength(3);
    getByText(buildMockedTranslation("games:gameName"));
    getByText(buildMockedTranslation("common:status"));

    expect(queryByTestId('games-table-row-tid')).toBeNull();
  });

  it('renders games list when games exist', () => {
    const minimalGameInstanceExposedInfos: MinimalGameInstanceExposedInfoT[] = [
      buildTestMinimalGameInstanceExposedInfo({
        minimalGameConfig: buildTestMinimalGameConfig({ gameName: "game-1" }),
        gameStatus: 'ended',
      }),
      buildTestMinimalGameInstanceExposedInfo({
        minimalGameConfig: buildTestMinimalGameConfig({ gameName: "game-2" }),
        gameStatus: 'ended',
      }),
    ];

    const { getAllByTestId, getByTestId } = render(
      <GamesTableView minimalGameInstanceExposedInfos={minimalGameInstanceExposedInfos} />
    );

    getByTestId('game-table-tid');
    getByTestId('game-table-header-tid');
    expect(getAllByTestId('game-table-title-tid')).toHaveLength(3);
    expect(getAllByTestId('games-table-row-tid')).toHaveLength(2);
  });
});
