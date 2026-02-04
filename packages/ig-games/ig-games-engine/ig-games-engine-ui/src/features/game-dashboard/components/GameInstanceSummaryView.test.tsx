
import { __engineAppUiMocks } from '@ig/app-engine-ui';
import { buildTestGameInstanceExposedInfo, buildTestGameState } from '@ig/games-engine-models/test-utils';
import { render } from '@testing-library/react-native';
import React from 'react';
import * as GameInstanceModel from '../../../domains/game-instance/model/rtk/GameInstanceModel';
import { GameInstanceSummaryView } from './GameInstanceSummaryView';

// mocks

jest.mock('../../../features/game-instance/common/GameStatusView', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');

  return {
    GameStatusView: View,
  };
});

jest.mock('../../../features/game-instance/dashboard/components/PlayersTableView', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');

  return {
    PlayersTableView: View,
  };
});

jest.mock('./OpenGameInstanceButtonLink', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');

  return {
    OpenGameInstanceButtonLink: View,
  };
});

// tests

describe('GameInstanceView', () => {
  const { onAppErrorMock } = __engineAppUiMocks;
  const useGameInstanceModelSpy = jest.spyOn(GameInstanceModel, 'useGameInstanceModel');

  afterEach(() => {
    jest.clearAllMocks();
  });

  const gameInstanceId = 'ABC';

  it('renders loading screen', () => {
    // setup mocks
    useGameInstanceModelSpy.mockReturnValue({
      isLoading: true,
      isError: false,
    });

    // render
    const { queryByTestId } = render(
      <GameInstanceSummaryView gameInstanceId={gameInstanceId} />
    );

    // verify components
    expect(queryByTestId("RnuiActivityIndicator-tid")).toBeTruthy();
  });

  it('renders error', () => {
  // setup mocks
    useGameInstanceModelSpy.mockReturnValue({
      isLoading: false,
      isError: true,
      appErrCode: "apiError:server",
    });

    // render
    render(
      <GameInstanceSummaryView gameInstanceId={gameInstanceId} />
    );

    // verify calls
    expect(onAppErrorMock).toHaveBeenCalledWith("apiError:server");
  });

  it('renders properly', async () => {
    // setup mocks
    useGameInstanceModelSpy.mockReturnValue({
      isLoading: false,
      isError: false,
      data: {
        gameInstanceExposedInfo: buildTestGameInstanceExposedInfo({
          gameState: buildTestGameState({ gameStatus: 'ended' })
        }),
        gameInstanceChatMessages: [],
      },
    });

    // render
    const { getByTestId } = render(
      <GameInstanceSummaryView gameInstanceId={gameInstanceId} />
    );

    // verify components
    getByTestId('GameStatusView-tid');
    getByTestId('PlayersTableView-tid');
    getByTestId('OpenGameInstanceButtonLink-tid');
  });
});
