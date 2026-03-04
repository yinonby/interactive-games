
import { buildPublicGameConfigMock } from '@ig/games-engine-models/test-utils';
import { render } from '@testing-library/react-native';
import React from 'react';
import * as GameConfigModelModule from '../../../domains/game-config/model/rtk/GameConfigModel';
import { GameDashboardView } from './GameDashboardView';

// mocks

jest.mock('../../../features/common/ModelLoadingView', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');

  return {
    ModelLoadingView: View,
  };
});

jest.mock('./GameConfigCardView', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');

  return {
    GameConfigCardView: View,
  };
});

jest.mock('./GameInstanceSummaryView', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');

  return {
    GameInstanceSummaryView: View,
  };
});

// tests

describe('GameDashboardView', () => {
  const spy_useGameConfigModel = jest.spyOn(GameConfigModelModule, 'useGameConfigModel');
  const gameConfigId = 'GC1'

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders ModelLoadingView when loading', () => {
    spy_useGameConfigModel.mockReturnValue({
      isLoading: true,
      isError: false,
    });

    const { getByTestId } = render(
      <GameDashboardView gameConfigId={gameConfigId} />
    );

    getByTestId("ModelLoadingView-tid");
  });

  it('renders ModelLoadingView when error', () => {
    spy_useGameConfigModel.mockReturnValue({
      isLoading: false,
      isError: true,
      appErrCode: "apiError:server",
    });

    const { getByTestId } = render(
      <GameDashboardView gameConfigId={gameConfigId} />
    );

    getByTestId("ModelLoadingView-tid");
  });

  it('renders properly', async () => {
    spy_useGameConfigModel.mockReturnValue({
      isLoading: false,
      isError: false,
      data: {
        publicGameConfig: buildPublicGameConfigMock(),
        gameInstanceIds: ['giid-1', 'giid-2'],
      },
    });

    const { getByTestId, getAllByTestId } = render(
      <GameDashboardView gameConfigId={gameConfigId}/>
    );

    getByTestId('GameConfigCardView-tid');
    expect(getAllByTestId('GameInstanceSummaryView-tid')).toHaveLength(2);
  });
});
