
import { __engineAppUiMocks } from '@ig/app-engine-ui';
import type { GameInfoT } from '@ig/games-engine-models';
import { buildTestGameInfo } from '@ig/games-engine-models/test-utils';
import { render } from '@testing-library/react-native';
import React from 'react';
import * as GamesUserConfigModel from '../../../domains/user-config/model/rtk/GamesUserConfigModel';
import { GameDashboardViewPageContent } from './GameDashboardViewPageContent';

// mocks
jest.mock("../components/GameDashboardView", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');

  return {
    GameDashboardView: View,
  };
});

describe("GameDashboardViewPageContent", () => {
  const { onAppErrorMock } = __engineAppUiMocks;
  const useGamesUserConfigModelSpy = jest.spyOn(GamesUserConfigModel, 'useGamesUserConfigModel');

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading screen', () => {
    useGamesUserConfigModelSpy.mockReturnValue({
      isLoading: true,
      isError: false,
    });

    const { queryByTestId } = render(
      <GameDashboardViewPageContent gameConfigId='GID1'/>
    );

    expect(queryByTestId("RnuiActivityIndicator-tid")).toBeTruthy();
  });

  it('renders error', () => {
    useGamesUserConfigModelSpy.mockReturnValue({
      isLoading: false,
      isError: true,
      appErrCode: "apiError:server",
    });

    render(
      <GameDashboardViewPageContent gameConfigId='GID1'/>
    );

    expect(onAppErrorMock).toHaveBeenCalledWith("apiError:server");
  });

  it('renders null when game not found', () => {
    useGamesUserConfigModelSpy.mockReturnValue({
      isLoading: false,
      isError: false,
      data: {
        gamesUserConfig: {
          joinedGameInfos: [],
        }
      },
    });

    const { queryByTestId } = render(
      <GameDashboardViewPageContent gameConfigId='GID1'/>
    );

    expect(queryByTestId('RnuiAppContent-tid')).toBeNull();
  });

  it("renders properly", async () => {
    const gameConfigId = "GID1";
    const joinedGameInfo: GameInfoT = buildTestGameInfo({ gameConfigId: gameConfigId });
    useGamesUserConfigModelSpy.mockReturnValue({
      isLoading: false,
      isError: false,
      data: {
        gamesUserConfig: {
          joinedGameInfos: [joinedGameInfo],
        }
      },
    });

    const { getByTestId } = render(
      <GameDashboardViewPageContent gameConfigId={gameConfigId}/>
    );

    getByTestId("RnuiAppContent-tid");
    const view = getByTestId("GameDashboardView-tid");

    expect(view.props.joinedGameInfo).toEqual(joinedGameInfo);
  });
});
