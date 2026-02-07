
import { __engineAppUiMocks } from '@ig/app-engine-ui';
import { buildTestGameInfo } from '@ig/games-engine-models/test-utils';
import { render } from '@testing-library/react-native';
import React from 'react';
import * as GameModel from '../../../domains/game/model/rtk/GameModel';
import { GameDashboardView } from './GameDashboardView';

// mocks

jest.mock('./GameInfoCardView', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');

  return {
    GameInfoCardView: View,
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
  const { onAppErrorMock } = __engineAppUiMocks;
  const useGameModelSpy = jest.spyOn(GameModel, 'useGameModel');

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading screen', () => {
    useGameModelSpy.mockReturnValue({
      isLoading: true,
      isError: false,
    });

    const joinedGameInfo = buildTestGameInfo({ gameName: 'g1' });
    const { queryByTestId } = render(
      <GameDashboardView joinedGameInfo={joinedGameInfo}/>
    );

    expect(queryByTestId("RnuiActivityIndicator-tid")).toBeTruthy();
  });

  it('renders error', () => {
    useGameModelSpy.mockReturnValue({
      isLoading: false,
      isError: true,
      appErrCode: "apiError:server",
    });

    const joinedGameInfo = buildTestGameInfo({ gameName: 'g1' });
    render(
      <GameDashboardView joinedGameInfo={joinedGameInfo}/>
    );

    expect(onAppErrorMock).toHaveBeenCalledWith("apiError:server");
  });

  it('renders properly', async () => {
    const joinedGameInfo = buildTestGameInfo({ gameName: 'g1' });
    useGameModelSpy.mockReturnValue({
      isLoading: false,
      isError: false,
      data: {
        gameInstanceIds: ['giid-1', 'giid-2'],
      },
    });

    const { getByTestId, getAllByTestId } = render(
      <GameDashboardView joinedGameInfo={joinedGameInfo}/>
    );

    getByTestId('GameInfoCardView-tid');
    expect(getAllByTestId('GameInstanceSummaryView-tid')).toHaveLength(2);
  });
});
