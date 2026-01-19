
import type { MinimalGameInstanceExposedInfoT } from "@ig/engine-models";
import { render } from '@testing-library/react-native';
import React from 'react';
import type { GameStatusViewPropsT } from "../../game-instance/components/GameStatusView";
import { GamesTableRow } from './GamesTableRow';

// mocks

jest.mock('@ig/platform-ui', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { Text } = require('react-native');

  return {
    PlatformUiLink: ({ children }: { children: React.ReactNode }) => (
      <Text testID="pui-link-tid">{children}</Text>
    ),
  }
});

jest.mock('../../game-instance/components/GameStatusView', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');

  return {
    GameStatusView: (props: GameStatusViewPropsT) => <View testID="add-game-view-tid"  {...props} />
  };
});

// tests

describe('GamesTableRow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders game row, admin', () => {
    const minimalGameInstanceExposedInfo: MinimalGameInstanceExposedInfoT = {
      gameInstanceId: "gid-1",
      invitationCode: "invt-code-gid-1",
      minimalGameConfig: {
        gameConfigId: "game-1",
        kind: "joint-game",
        gameName: 'Poker Night',
        maxDurationMinutes: 30,
        maxParticipants: 4
      },
      playerRole: "admin",
      playerStatus: "playing",
      gameStatus: "in-process",
    };

    const { getByTestId, getAllByTestId } = render(
      <GamesTableRow minimalGameInstanceExposedInfo={minimalGameInstanceExposedInfo} />
    );

    getByTestId('games-table-row-tid');
    expect(getAllByTestId('games-table-cell-tid')).toHaveLength(4);
    getByTestId('game-name-text-tid');
    getByTestId('user-role-text-tid');
    getByTestId('pui-link-tid');
    getByTestId('open-game-btn-tid');
  });

  it('renders game row, player', () => {
    const minimalGameInstanceExposedInfo: MinimalGameInstanceExposedInfoT = {
      gameInstanceId: "gid-1",
      invitationCode: "invt-code-gid-1",
      minimalGameConfig: {
        gameConfigId: "game-1",
        kind: "joint-game",
        gameName: 'Poker Night',
        maxDurationMinutes: 30,
        maxParticipants: 4
      },
      playerRole: "player",
      playerStatus: "playing",
      gameStatus: "in-process",
    };

    const { getByTestId, getAllByTestId } = render(
      <GamesTableRow minimalGameInstanceExposedInfo={minimalGameInstanceExposedInfo} />
    );

    getByTestId('games-table-row-tid');
    expect(getAllByTestId('games-table-cell-tid')).toHaveLength(4);
    getByTestId('game-name-text-tid');
    getByTestId('user-role-text-tid');
    getByTestId('pui-link-tid');
    getByTestId('open-game-btn-tid');
  });
});
