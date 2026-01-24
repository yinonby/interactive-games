
import { __engineAppUiMocks, type AppConfigContextT } from '@ig/engine-app-ui';
import type { GameInstanceExposedInfoT } from '@ig/games-models';
import { buildTestGameConfig, buildTestGameInstanceExposedInfo, buildTestPlayerExposedInfo } from '@ig/games-models/test-utils';
import { render } from '@testing-library/react-native';
import React from 'react';
import { GameInstanceView } from './GameInstanceView';

// mocks

jest.mock('../../../common/game-config/GameImageCard', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');

  return {
    GameImageCard: View,
  };
});

jest.mock('./GameInstanceConfigSummaryView', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');

  return {
    GameInstanceConfigSummaryView: View,
  };
});

jest.mock('./InviteView', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');

  return {
    InviteView: View,
  };
});

jest.mock('./PlayersView', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');

  return {
    PlayersView: View,
  };
});

jest.mock('../../common/ChatView', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');

  return {
    ChatView: View,
  };
});

describe('GameInstanceView', () => {
  const { useAppConfigMock, loggerErrorMock } = __engineAppUiMocks;

  // mock curUserId
  const curUserIdMock = 'userIdMock';
  useAppConfigMock.mockReturnValue({
    curUserId: curUserIdMock,
  } as AppConfigContextT);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('does not render when current user is not in players list', () => {
    // build gameInstanceExposedInfo
    const gameInstanceExposedInfo: GameInstanceExposedInfoT = buildTestGameInstanceExposedInfo({
      playerExposedInfos: [buildTestPlayerExposedInfo({
        playerUserId: 'otherUser',
        playerRole: 'player',
      })],
    });

    const { queryByTestId } = render(
      <GameInstanceView gameInstanceExposedInfo={gameInstanceExposedInfo} gameInstanceChatMessages={[]} />
    );

    expect(useAppConfigMock).toHaveBeenCalled();
    expect(loggerErrorMock).toHaveBeenCalled();
    expect(queryByTestId('container-tid')).toBeNull();
  });

  it('renders correctly, with InviteView for admin', () => {
    // build gameInstanceExposedInfo
    const gameConfig = buildTestGameConfig({});
    const gameInstanceExposedInfo: GameInstanceExposedInfoT = buildTestGameInstanceExposedInfo({
      gameInstanceId: 'gid-1',
      gameConfig: gameConfig,
      playerExposedInfos: [buildTestPlayerExposedInfo({
        playerUserId: curUserIdMock,
        playerRole: 'admin',
      })],
    });

    const { getByTestId } = render(
      <GameInstanceView gameInstanceExposedInfo={gameInstanceExposedInfo} gameInstanceChatMessages={[]} />
    );

    expect(useAppConfigMock).toHaveBeenCalled();
    expect(loggerErrorMock).not.toHaveBeenCalled();
    getByTestId('container-tid');
    const card = getByTestId('GameImageCard-tid');
    expect(card.props.minimalGameConfig).toEqual(gameConfig)
    expect(card.props.includeFreeLabel).toEqual(false)
    getByTestId('GameInstanceConfigSummaryView-tid');
    getByTestId('InviteView-tid');
    getByTestId('PlayersView-tid');
    getByTestId('ChatView-tid');
  });

  it('renders correctly, without InviteView for non-admin', () => {
    // build gameInstanceExposedInfo
    const gameConfig = buildTestGameConfig({});
    const gameInstanceExposedInfo: GameInstanceExposedInfoT = buildTestGameInstanceExposedInfo({
      gameInstanceId: 'gid-1',
      gameConfig: gameConfig,
      playerExposedInfos: [buildTestPlayerExposedInfo({
        playerUserId: curUserIdMock,
        playerRole: 'player',
      })],
    });

    const { queryByTestId } = render(
      <GameInstanceView gameInstanceExposedInfo={gameInstanceExposedInfo} gameInstanceChatMessages={[]} />
    );

    expect(queryByTestId('InviteView-tid')).toBeNull();
  });
});
