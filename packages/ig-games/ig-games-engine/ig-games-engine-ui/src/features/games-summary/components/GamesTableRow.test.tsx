
import { __engineAppUiMocks } from '@ig/app-engine-ui';
import type { PublicGameConfigT } from '@ig/games-engine-models';
import { buildPublicGameConfigMock } from '@ig/games-engine-models/test-utils';
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
    const joinedPublicGameConfig: PublicGameConfigT = buildPublicGameConfigMock({
      gameName: 'Poker Night',
    });

    const { getByTestId, getAllByTestId } = render(
      <GamesTableRow joinedPublicGameConfig={joinedPublicGameConfig} />
    );

    // verify calls
    expect(buildGameDashboardUrlPathMock).toHaveBeenCalledWith(joinedPublicGameConfig.gameConfigId);

    // verify components
    getByTestId('RnuiTableRow-tid');
    expect(getAllByTestId('RnuiTableCell-tid')).toHaveLength(2);
    const text = getByTestId("gameName-text-tid");
    expect(text.props.children).toEqual(joinedPublicGameConfig.gameName);
    getByTestId('PlatformUiLink-tid');
    getByTestId('open-game-btn-tid');
  });
});
