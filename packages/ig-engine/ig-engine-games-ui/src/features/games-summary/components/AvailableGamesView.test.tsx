
import { __engineAppUiMocks, type AppErrorCodeT } from "@ig/engine-app-ui";
import type { GamesConfigT, GamesUserConfigT } from '@ig/engine-models';
import { buildTestMinimalGameConfig, buildTestMinimalGameInstanceExposedInfo } from '@ig/engine-models/test-utils';
import { render } from "@testing-library/react-native";
import React from "react";
import { buildMockedTranslation } from "../../../../test/mocks/EngineAppUiMocks";
import * as GamesConfigModel from "../../../domains/games-config/model/rtk/GamesConfigModel";
import * as GamesUserConfigModel from "../../../domains/user-config/model/rtk/GamesUserConfigModel";
import { AvailableGamesView } from "./AvailableGamesView";

jest.mock("./MinimalGameCardView", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');

  return {
    MinimalGameCardView: View,
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
      data: { gamesConfig: {} as GamesConfigT },
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
      buildTestMinimalGameConfig({ gameConfigId: "g1" }),
      buildTestMinimalGameConfig({ gameConfigId: "g2" }),
    ];
    const minimalGameInstanceExposedInfos = [
      buildTestMinimalGameInstanceExposedInfo({
        minimalGameConfig: buildTestMinimalGameConfig({ gameConfigId: "g1" }),
      }),
      buildTestMinimalGameInstanceExposedInfo({
        minimalGameConfig: buildTestMinimalGameConfig({ gameConfigId: "g2" }),
      }),
    ]

    useGamesConfigModelSpy.mockReturnValue({
      isLoading: false,
      isError: false,
      data: {
        gamesConfig: {
          availableMinimalGameConfigs: availableMinimalGameConfigs
        }
      }
    });
    useGamesUserConfigModelSpy.mockReturnValue({
      isLoading: false,
      isError: false,
      data: {
        gamesUserConfig: {
          minimalGameInstanceExposedInfos: minimalGameInstanceExposedInfos
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
      buildTestMinimalGameConfig({ gameConfigId: "g1" }),
      buildTestMinimalGameConfig({ gameConfigId: "g2" }),
    ];
    const minimalGameInstanceExposedInfos = [
      buildTestMinimalGameInstanceExposedInfo({
        minimalGameConfig: buildTestMinimalGameConfig({ gameConfigId: "g1" }),
      }),
    ]

    useGamesConfigModelSpy.mockReturnValue({
      isLoading: false,
      isError: false,
      data: {
        gamesConfig: {
          availableMinimalGameConfigs: availableMinimalGameConfigs
        }
      }
    });
    useGamesUserConfigModelSpy.mockReturnValue({
      isLoading: false,
      isError: false,
      data: {
        gamesUserConfig: {
          minimalGameInstanceExposedInfos: minimalGameInstanceExposedInfos
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