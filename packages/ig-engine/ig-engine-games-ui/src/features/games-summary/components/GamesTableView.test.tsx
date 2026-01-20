
import type { MinimalGameInstanceExposedInfoT } from "@ig/engine-models";
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

    expect(getAllByTestId('game-table-title-tid')).toHaveLength(4);
    getByText(buildMockedTranslation("games:gameName"));
    getByText(buildMockedTranslation("common:status"));
    getByText(buildMockedTranslation("common:role"));

    expect(queryByTestId('games-table-row-tid')).toBeNull();
  });

  it('renders games list when games exist', () => {
    const minimalGameInstanceExposedInfos: MinimalGameInstanceExposedInfoT[] = [{
      gameInstanceId: "gid-1",
      invitationCode: "invt-code-gid-1",
      minimalGameConfig: {
        gameConfigId: "game-1",
        kind: "joint-game",
        gameName: 'Poker Night',
        maxDurationMinutes: 30,
        gamePrice: "free",
        maxParticipants: 4,
        imageAssetName: "escape-room-1",
      },
      playerRole: "admin",
      playerStatus: "playing",
      gameStatus: "in-process",
    }, {
      gameInstanceId: "gid-2",
      invitationCode: "invt-code-gid-2",
      minimalGameConfig: {
        gameConfigId: "game-2",
        kind: "joint-game",
        gameName: 'Chess Match',
        maxDurationMinutes: 30,
        gamePrice: "free",
        maxParticipants: 4,
        imageAssetName: "escape-room-1",
      },
      playerRole: "player",
      playerStatus: "playing",
      gameStatus: "in-process",
    }];

    const { getAllByTestId, getByTestId } = render(
      <GamesTableView minimalGameInstanceExposedInfos={minimalGameInstanceExposedInfos} />
    );

    getByTestId('game-table-tid');
    getByTestId('game-table-header-tid');
    expect(getAllByTestId('game-table-title-tid')).toHaveLength(4);
    expect(getAllByTestId('games-table-row-tid')).toHaveLength(2);
  });
});
