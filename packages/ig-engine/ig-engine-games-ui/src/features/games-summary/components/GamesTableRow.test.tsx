
import { __engineAppUiMocks, type AppConfigContextT, type GamesUiUrlPathsAdapter } from '@ig/engine-app-ui';
import type { MinimalGameInstanceExposedInfoT } from "@ig/engine-models";
import { buildTestMinimalGameConfig, buildTestMinimalGameInstanceExposedInfo } from '@ig/engine-models/test-utils';
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
  const { useAppConfigMock } = __engineAppUiMocks;
  const buildGameInstanceDashboardUrlPathMock = jest.fn();

  // mock curUserId
  useAppConfigMock.mockReturnValue({
    gamesUiUrlPathsAdapter: {
      buildGameInstanceDashboardUrlPath: buildGameInstanceDashboardUrlPathMock,
    } as unknown as GamesUiUrlPathsAdapter,
  } as AppConfigContextT);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders games summary table row', () => {
    const minimalGameInstanceExposedInfo: MinimalGameInstanceExposedInfoT = buildTestMinimalGameInstanceExposedInfo({
      gameInstanceId: "gid-1",
      minimalGameConfig: buildTestMinimalGameConfig({
        gameName: 'Poker Night',
      }),
      gameStatus: "in-process",
    });

    const { getByTestId, getAllByTestId } = render(
      <GamesTableRow minimalGameInstanceExposedInfo={minimalGameInstanceExposedInfo} />
    );

    // verify calls
    expect(buildGameInstanceDashboardUrlPathMock).toHaveBeenCalledWith(minimalGameInstanceExposedInfo.gameInstanceId);

    // verify components
    getByTestId('games-table-row-tid');
    expect(getAllByTestId('games-table-cell-tid')).toHaveLength(3);
    getByTestId('game-name-text-tid');
    getByTestId('pui-link-tid');
    getByTestId('open-game-btn-tid');
  });
});
