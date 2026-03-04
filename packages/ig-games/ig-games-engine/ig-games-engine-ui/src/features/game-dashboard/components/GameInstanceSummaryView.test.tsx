
import { buildTestGameInstanceExposedInfo, buildTestGameState } from '@ig/games-engine-models/test-utils';
import { render } from '@testing-library/react-native';
import React from 'react';
import * as GameInstanceModel from '../../../domains/game-instance/model/rtk/GameInstanceModel';
import { GameInstanceSummaryView } from './GameInstanceSummaryView';

// mocks

jest.mock('../../../features/common/ModelLoadingView', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');

  return {
    ModelLoadingView: View,
  };
});

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
  const useGameInstanceModelSpy = jest.spyOn(GameInstanceModel, 'useGameInstanceModel');
  const gameInstanceId = 'ABC';

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders ModelLoadingView when loading', () => {
    useGameInstanceModelSpy.mockReturnValue({
      isLoading: true,
      isError: false,
    });

    const { getByTestId } = render(
      <GameInstanceSummaryView gameInstanceId={gameInstanceId} />
    );

    getByTestId("ModelLoadingView-tid");
  });

  it('renders ModelLoadingView when error', () => {
    useGameInstanceModelSpy.mockReturnValue({
      isLoading: false,
      isError: true,
      appErrCode: "apiError:server",
    });

    const { getByTestId } = render(
      <GameInstanceSummaryView gameInstanceId={gameInstanceId} />
    );

    getByTestId("ModelLoadingView-tid");
  });

  it('renders properly', async () => {
    // setup mocks
    useGameInstanceModelSpy.mockReturnValue({
      isLoading: false,
      isError: false,
      data: {
        publicGameInstance: buildTestGameInstanceExposedInfo({
          gameState: buildTestGameState({ gameStatus: 'ended' })
        }),
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
