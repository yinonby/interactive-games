
import { __engineAppUiMocks } from '@ig/app-engine-ui';
import { __authUiMocks } from '@ig/auth-ui';
import type { GameInstanceExposedInfoT } from '@ig/games-engine-models';
import { buildTestGameInfo, buildTestGameInstanceExposedInfo, buildTestGameState, buildTestPlayerExposedInfo } from '@ig/games-engine-models/test-utils';
import { render } from '@testing-library/react-native';
import React from 'react';
import { GameInstanceView } from './GameInstanceView';

// mocks

jest.mock('./InviteView', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');

  return {
    InviteView: View,
  };
});

jest.mock('../../../common/game-info/GameImageCard', () => {
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

jest.mock('./LevelsView', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');

  return {
    LevelsView: View,
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
  const { loggerErrorMock } = __engineAppUiMocks;
  const { useAuthMock } = __authUiMocks;

  // mock curAccountId
  const curUserIdMock = 'userIdMock';
  useAuthMock.mockReturnValue({
    curAccountId: curUserIdMock,
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('does not render when current user is not in players list', () => {
    // build gameInstanceExposedInfo
    const gameInstanceExposedInfo: GameInstanceExposedInfoT = buildTestGameInstanceExposedInfo({
      playerExposedInfos: [buildTestPlayerExposedInfo({
        playerAccountId: 'otherUser',
        playerRole: 'player',
      })],
    });

    const { queryByTestId } = render(
      <GameInstanceView gameInstanceExposedInfo={gameInstanceExposedInfo} gameInstanceChatMessages={[]} />
    );

    expect(useAuthMock).toHaveBeenCalled();
    expect(loggerErrorMock).toHaveBeenCalled();
    expect(queryByTestId('container-tid')).toBeNull();
  });

  it('renders correctly, with InviteView for admin and LevelsView when game is not notStarted', () => {
    // build gameInstanceExposedInfo
    const gameInfo = buildTestGameInfo({});
    const gameInstanceExposedInfo: GameInstanceExposedInfoT = buildTestGameInstanceExposedInfo({
      gameInstanceId: 'gid-1',
      gameInfo: gameInfo,
      playerExposedInfos: [buildTestPlayerExposedInfo({
        playerAccountId: curUserIdMock,
        playerRole: 'admin',
      })],
      gameState: buildTestGameState({
        gameStatus: 'inProcess',
      }),
    });

    const { getByTestId } = render(
      <GameInstanceView gameInstanceExposedInfo={gameInstanceExposedInfo} gameInstanceChatMessages={[]} />
    );

    expect(useAuthMock).toHaveBeenCalled();
    expect(loggerErrorMock).not.toHaveBeenCalled();

    getByTestId('container-tid');

    // first grid item
    getByTestId('InviteView-tid');

    // second grid item
    const card = getByTestId('GameImageCard-tid');
    expect(card.props.minimalGameInfo).toEqual(gameInfo);
    expect(card.props.includeFreeLabel).toEqual(false);

    getByTestId('GameInstanceConfigSummaryView-tid');
    getByTestId('LevelsView-tid');

    // third grid item
    getByTestId('PlayersView-tid');
    getByTestId('ChatView-tid');
  });

  it('does not render InviteView for non-admin', () => {
    // build gameInstanceExposedInfo
    const gameInfo = buildTestGameInfo({});
    const gameInstanceExposedInfo: GameInstanceExposedInfoT = buildTestGameInstanceExposedInfo({
      gameInstanceId: 'gid-1',
      gameInfo: gameInfo,
      playerExposedInfos: [buildTestPlayerExposedInfo({
        playerAccountId: curUserIdMock,
        playerRole: 'player',
      })],
      gameState: buildTestGameState({
        gameStatus: 'inProcess',
      }),
    });

    const { queryByTestId } = render(
      <GameInstanceView gameInstanceExposedInfo={gameInstanceExposedInfo} gameInstanceChatMessages={[]} />
    );

    expect(queryByTestId('InviteView-tid')).toBeNull();
  });

  it('does not render LevelsView when game is notStarted', () => {
    // build gameInstanceExposedInfo
    const gameInfo = buildTestGameInfo({});
    const gameInstanceExposedInfo: GameInstanceExposedInfoT = buildTestGameInstanceExposedInfo({
      gameInstanceId: 'gid-1',
      gameInfo: gameInfo,
      playerExposedInfos: [buildTestPlayerExposedInfo({
        playerAccountId: curUserIdMock,
        playerRole: 'admin',
      })],
      gameState: buildTestGameState({
        gameStatus: 'notStarted',
      }),
    });

    const { queryByTestId } = render(
      <GameInstanceView gameInstanceExposedInfo={gameInstanceExposedInfo} gameInstanceChatMessages={[]} />
    );

    expect(queryByTestId('LevelsView-tid')).toBeNull();
  });
});
