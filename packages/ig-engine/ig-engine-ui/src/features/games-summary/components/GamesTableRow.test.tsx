
import type { GameInstanceIdT, MinimalGameInstanceExposedInfoT } from "@ig/engine-models";
import type { RnuiImageSourceT } from "@ig/rnui";
import { render } from '@testing-library/react-native';
import React from 'react';
import * as GameContextProvider from "../../../app/layout/GameContextProvider";
import type { GameImageTypeT } from "../../../types/GameImageTypes";
import type { GameUiUrlPathsAdapter } from "../../../types/GameUiConfigTypes";
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
  const useGameContextSpy = jest.spyOn(GameContextProvider, "useGameContext");

  const imagesSourceMap = {
    ["treasure-hunt-1"]: { uri: "http://example.com/cover.png" },
  } as Record<GameImageTypeT, RnuiImageSourceT>;
  const gameUiUrlPathsAdapter: GameUiUrlPathsAdapter = {
    buildGameInstanceDashboardUrlPath: (gameInstanceId: GameInstanceIdT) => `gi-dashboard-${gameInstanceId}`,
  } as GameUiUrlPathsAdapter;

  beforeEach(() => {
    jest.clearAllMocks();

    useGameContextSpy.mockReturnValue({
      imagesSourceMap: imagesSourceMap,
      gameUiUrlPathsAdapter: gameUiUrlPathsAdapter,
    } as GameContextProvider.GameContextT);
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

    const { queryByTestId, getAllByTestId } = render(
      <GamesTableRow minimalGameInstanceExposedInfo={minimalGameInstanceExposedInfo} />
    );

    expect(queryByTestId('games-table-row-tid')).toBeTruthy();
    expect(getAllByTestId('games-table-cell-tid')).toHaveLength(4);
    expect(getAllByTestId('game-name-text-tid')).toHaveLength(1);
    expect(getAllByTestId('user-role-text-tid')).toHaveLength(1);
    expect(getAllByTestId('pui-link-tid')).toHaveLength(1);
    expect(getAllByTestId('open-game-btn-tid')).toHaveLength(1);
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

    const { queryByTestId, getAllByTestId } = render(
      <GamesTableRow minimalGameInstanceExposedInfo={minimalGameInstanceExposedInfo} />
    );

    expect(queryByTestId('games-table-row-tid')).toBeTruthy();
    expect(getAllByTestId('games-table-cell-tid')).toHaveLength(4);
    expect(getAllByTestId('game-name-text-tid')).toHaveLength(1);
    expect(getAllByTestId('user-role-text-tid')).toHaveLength(1);
    expect(getAllByTestId('pui-link-tid')).toHaveLength(1);
    expect(getAllByTestId('open-game-btn-tid')).toHaveLength(1);
  });
});
