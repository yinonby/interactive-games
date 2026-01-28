
import { __engineAppUiMocks, type AppErrorCodeT } from "@ig/engine-ui";
import type { GameConfigT, GamesUserConfigT } from '@ig/games-models';
import { buildTestGameConfig } from '@ig/games-models/test-utils';
import { render } from "@testing-library/react-native";
import React from "react";
import { buildMockedTranslation } from "../../../../test/mocks/EngineAppUiMocks";
import * as GamesConfigModel from "../../../domains/games-config/model/rtk/GamesConfigModel";
import * as GamesUserConfigModel from "../../../domains/user-config/model/rtk/GamesUserConfigModel";
import { AvailableGamesView } from "./AvailableGamesView";

jest.mock("./JoinableGameCardView", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');

  return {
    JoinableGameCardView: View,
  };
});

describe("AvailableGamesView", () => {
  const { onAppErrorMock } = __engineAppUiMocks;
  const useGamesConfigModelSpy = jest.spyOn(GamesConfigModel, 'useGamesConfigModel');
  const useGamesUserConfigModelSpy = jest.spyOn(GamesUserConfigModel, 'useGamesUserConfigModel');

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("renders Loading when either model is loading", () => {
    useGamesConfigModelSpy.mockReturnValue({
      isLoading: true,
      isError: false,
      data: undefined
    });
    useGamesUserConfigModelSpy.mockReturnValue({
      isLoading: false,
      isError: false,
      data: { gamesUserConfig: {} as GamesUserConfigT },
    });

    const { queryByTestId } = render(<AvailableGamesView />);
    expect(queryByTestId("activity-indicator-tid")).toBeTruthy();
  });

  it("renders Error when games-config model has error", () => {
    useGamesConfigModelSpy.mockReturnValue({
      isLoading: false,
      isError: true,
      appErrCode: "ERR" as AppErrorCodeT,
      data: undefined
    });
    useGamesUserConfigModelSpy.mockReturnValue({
      isLoading: false,
      isError: false,
      data: { gamesUserConfig: {} as GamesUserConfigT },
    });

    render(<AvailableGamesView />);

    expect(onAppErrorMock).toHaveBeenCalledWith("ERR");
  });

  it("renders Error when user-config model has error", () => {
    useGamesConfigModelSpy.mockReturnValue({
      isLoading: false,
      isError: false,
      data: { minimalGameConfigs: [] },
    });
    useGamesUserConfigModelSpy.mockReturnValue({
      isLoading: false,
      isError: true,
      appErrCode: "ERR" as AppErrorCodeT,
    });

    render(<AvailableGamesView />);

    expect(onAppErrorMock).toHaveBeenCalledWith("ERR");
  });

  it('renders "No games are available" when user has joined all available games', () => {
    const availableMinimalGameConfigs = [
      buildTestGameConfig({ gameConfigId: "g1" }),
      buildTestGameConfig({ gameConfigId: "g2" }),
    ];
    const joinedGameConfigs: GameConfigT[] = [
      buildTestGameConfig({ gameConfigId: "g1" }),
      buildTestGameConfig({ gameConfigId: "g2" }),
    ]

    useGamesConfigModelSpy.mockReturnValue({
      isLoading: false,
      isError: false,
      data: {
        minimalGameConfigs: availableMinimalGameConfigs,
      }
    });
    useGamesUserConfigModelSpy.mockReturnValue({
      isLoading: false,
      isError: false,
      data: {
        gamesUserConfig: {
          joinedGameConfigs: joinedGameConfigs,
        }
      }
    });

    const { getByTestId, queryByTestId, getByText } = render(<AvailableGamesView />);
    getByTestId("no-available-games-text-tid");
    getByText(buildMockedTranslation("games:noGamesAbailable"));

    expect(queryByTestId("grid-tid")).toBeNull();
  });

  it('renders "Available games:" and grid when there are non-joined games', () => {
    const availableMinimalGameConfigs = [
      buildTestGameConfig({ gameConfigId: "g1" }),
      buildTestGameConfig({ gameConfigId: "g2" }),
    ];
    const joinedGameConfigs: GameConfigT[] = [
      buildTestGameConfig({ gameConfigId: "g1" }),
    ]

    useGamesConfigModelSpy.mockReturnValue({
      isLoading: false,
      isError: false,
      data: {
        minimalGameConfigs: availableMinimalGameConfigs,
      }
    });
    useGamesUserConfigModelSpy.mockReturnValue({
      isLoading: false,
      isError: false,
      data: {
        gamesUserConfig: {
          joinedGameConfigs: joinedGameConfigs,
        }
      }
    });

    const { getByTestId, getByText } = render(<AvailableGamesView />);
    getByTestId("available-games-text-tid");
    getByText(buildMockedTranslation("games:abailableGames"));

    getByTestId("grid-tid");
    getByTestId("game-card-view-tid");
  });
});