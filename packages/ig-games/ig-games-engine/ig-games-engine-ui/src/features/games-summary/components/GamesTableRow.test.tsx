
import { __engineAppUiMocks } from '@ig/app-engine-ui';
import type { GameInfoT } from '@ig/games-engine-models';
import { buildTestGameInfo } from '@ig/games-engine-models/test-utils';
import { render } from '@testing-library/react-native';
import React from 'react';
import { GamesTableRow } from './GamesTableRow';

// mocks

jest.mock('@ig/platform-ui', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { Text } = require('react-native');

  return {
    PlatformUiLink: ({ children }: { children: React.ReactNode }) => (
      <Text testID="PlatformUiLink-tid">{children}</Text>
    ),
  }
});

// tests

describe('GamesTableRow', () => {
  const { buildGameDashboardUrlPathMock } = __engineAppUiMocks;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders games summary table row', () => {
    const joinedGameInfo: GameInfoT = buildTestGameInfo({
      gameName: 'Poker Night',
    });

    const { getByTestId, getAllByTestId } = render(
      <GamesTableRow joinedGameInfo={joinedGameInfo} />
    );

    // verify calls
    expect(buildGameDashboardUrlPathMock).toHaveBeenCalledWith(joinedGameInfo.gameConfigId);

    // verify components
    getByTestId('RnuiTableRow-tid');
    expect(getAllByTestId('RnuiTableCell-tid')).toHaveLength(2);
    const text = getByTestId("gameName-text-tid");
    expect(text.props.children).toEqual(joinedGameInfo.gameName);
    getByTestId('PlatformUiLink-tid');
    getByTestId('open-game-btn-tid');
  });
});
