
import { __engineAppUiMocks, type AppErrorCodeT } from '@ig/app-engine-ui';
import { buildMockedTranslation } from '@ig/app-engine-ui/test-utils';
import { buildGameUserMock, buildPublicGameConfigMock } from '@ig/games-engine-models/test-utils';
import { render } from '@testing-library/react-native';
import React from 'react';
import * as GameUserModelModule from '../../../domains/game-user/model/rtk/GameUserModel';
import * as GamesAppModelModule from '../../../domains/games-app/model/rtk/GamesAppModel';
import { AvailableGamesView } from './AvailableGamesView';

jest.mock("./JoinableGameCardView", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');

  return {
    JoinableGameCardView: View,
  };
});

describe("AvailableGamesView", () => {
  const { onAppErrorMock } = __engineAppUiMocks;
  const spy_useGamesAppModel = jest.spyOn(GamesAppModelModule, 'useGamesAppModel');
  const spy_useGameUserModel = jest.spyOn(GameUserModelModule, 'useGameUserModel');

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("renders Loading when either model is loading", () => {
    spy_useGamesAppModel.mockReturnValue({
      isLoading: true,
      isError: false,
      data: undefined
    });
    spy_useGameUserModel.mockReturnValue({
      isLoading: false,
      isError: false,
      data: { publicGameUser: buildGameUserMock() },
    });

    const { queryByTestId } = render(<AvailableGamesView />);
    expect(queryByTestId("activity-indicator-tid")).toBeTruthy();
  });

  it("renders Error when games-config model has error", () => {
    spy_useGamesAppModel.mockReturnValue({
      isLoading: false,
      isError: true,
      appErrCode: "ERR" as AppErrorCodeT,
      data: undefined
    });
    spy_useGameUserModel.mockReturnValue({
      isLoading: false,
      isError: false,
      data: { publicGameUser: buildGameUserMock() },
    });

    render(<AvailableGamesView />);

    expect(onAppErrorMock).toHaveBeenCalledWith("ERR");
  });

  it("renders Error when user-config model has error", () => {
    spy_useGamesAppModel.mockReturnValue({
      isLoading: false,
      isError: false,
      data: { minimalPublicGameConfigs: [] },
    });
    spy_useGameUserModel.mockReturnValue({
      isLoading: false,
      isError: true,
      appErrCode: "ERR" as AppErrorCodeT,
    });

    render(<AvailableGamesView />);

    expect(onAppErrorMock).toHaveBeenCalledWith("ERR");
  });

  it('renders "No games are available" when user has joined all available games', () => {
    const availableMinimalPublicGameConfigs = [
      buildPublicGameConfigMock({ gameConfigId: "GC1" }),
      buildPublicGameConfigMock({ gameConfigId: "GC2" }),
    ];

    spy_useGamesAppModel.mockReturnValue({
      isLoading: false,
      isError: false,
      data: {
        minimalPublicGameConfigs: availableMinimalPublicGameConfigs,
      }
    });
    spy_useGameUserModel.mockReturnValue({
      isLoading: false,
      isError: false,
      data: {
        publicGameUser: buildGameUserMock({
          joinedGameConfigIds: ['GC1', 'GC2']
        }),
      }
    });

    const { getByTestId, queryByTestId, getByText } = render(<AvailableGamesView />);
    getByTestId("no-available-games-text-tid");
    getByText(buildMockedTranslation("games:noGamesAbailable"));

    expect(queryByTestId("grid-tid")).toBeNull();
  });

  it('renders "Available games:" and grid when there are non-joined games', () => {
    const availableMinimalPublicGameConfigs = [
      buildPublicGameConfigMock({ gameConfigId: "GC1" }),
      buildPublicGameConfigMock({ gameConfigId: "GC2" }),
    ];

    spy_useGamesAppModel.mockReturnValue({
      isLoading: false,
      isError: false,
      data: {
        minimalPublicGameConfigs: availableMinimalPublicGameConfigs,
      }
    });
    spy_useGameUserModel.mockReturnValue({
      isLoading: false,
      isError: false,
      data: {
        publicGameUser: buildGameUserMock({
          joinedGameConfigIds: ['GC1']
        }),
      }
    });

    const { getByTestId, getByText } = render(<AvailableGamesView />);
    getByTestId("available-games-text-tid");
    getByText(buildMockedTranslation("games:abailableGames"));

    getByTestId("grid-tid");
    getByTestId("game-card-view-tid");
  });
});