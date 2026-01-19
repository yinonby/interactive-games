
import { render } from "@testing-library/react-native";
import React from "react";
import { __errorHandlingMocks } from "../../../app/error-handling/AppErrorHandlingProvider";
import { buildMockedTranslation } from "../../../app/localization/__mocks__/AppLocalizationProvider";
import { useGamesConfigModel } from "../../../domains/games-config/model/rtk/GamesConfigModel";
import { useUserConfigModel } from "../../../domains/user-config/model/rtk/UserConfigModel";
import { AvailableGamesView } from "./AvailableGamesView";

jest.mock("./MinimalGameCardView", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');

  return {
    MinimalGameCardView: View,
  };
});

jest.mock("../../../domains/games-config/model/rtk/GamesConfigModel", () => ({
  useGamesConfigModel: jest.fn(),
}));

jest.mock("../../../domains/user-config/model/rtk/UserConfigModel", () => ({
  useUserConfigModel: jest.fn(),
}));

const mockUseAppConfigModel = useGamesConfigModel as jest.Mock;
const mockUseUserConfigModel = useUserConfigModel as jest.Mock;

describe("AvailableGamesView", () => {
  const { onErrorMock } = __errorHandlingMocks;

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("renders Loading when either model is loading", () => {
    mockUseAppConfigModel.mockReturnValue({ isLoading: true, isError: false, data: null });
    mockUseUserConfigModel.mockReturnValue({ isLoading: false, isError: false, data: null });

    const { queryByTestId } = render(<AvailableGamesView />);
    expect(queryByTestId("activity-indicator-tid")).toBeTruthy();
  });

  it("renders Error when games-config model has error", () => {
    mockUseAppConfigModel.mockReturnValue({ isLoading: false, isError: true, appErrCode: "ERR", data: null });
    mockUseUserConfigModel.mockReturnValue({ isLoading: false, isError: false, data: null });

    render(<AvailableGamesView />);

    expect(onErrorMock).toHaveBeenCalledWith("ERR");
  });

  it("renders Error when user-config model has error", () => {
    mockUseAppConfigModel.mockReturnValue({ isLoading: false, isError: false, data: null });
    mockUseUserConfigModel.mockReturnValue({ isLoading: false, isError: true, appErrCode: "ERR", data: null });

    render(<AvailableGamesView />);

    expect(onErrorMock).toHaveBeenCalledWith("ERR");
  });

  it('renders "No games are available" when user has joined all available games', () => {
    const available = [{ gameConfigId: "g1" }, { gameConfigId: "g2" }];
    const userInfos = [{ minimalGameConfig: { gameConfigId: "g1" } }, { minimalGameConfig: { gameConfigId: "g2" } }];

    mockUseAppConfigModel.mockReturnValue({ isLoading: false, isError: false, data: { availableMinimalGameConfigs: available } });
    mockUseUserConfigModel.mockReturnValue({ isLoading: false, isError: false, data: { minimalGameInstanceExposedInfos: userInfos } });

    const { getByTestId, queryByTestId, getByText } = render(<AvailableGamesView />);
    getByTestId("no-available-games-text-tid");
    getByText(buildMockedTranslation("games:noGamesAbailable"));

    expect(queryByTestId("grid-tid")).toBeNull();
  });

  it('renders "Available games:" and grid when there are non-joined games', () => {
    const available = [{ gameConfigId: "g1" }, { gameConfigId: "g2" }];
    const userInfos = [{ minimalGameConfig: { gameConfigId: "g1" } }];

    mockUseAppConfigModel.mockReturnValue({ isLoading: false, isError: false, data: { availableMinimalGameConfigs: available } });
    mockUseUserConfigModel.mockReturnValue({ isLoading: false, isError: false, data: { minimalGameInstanceExposedInfos: userInfos } });

    const { getByTestId, getByText } = render(<AvailableGamesView />);
    getByTestId("available-games-text-tid");
    getByText(buildMockedTranslation("games:abailableGames"));

    getByTestId("grid-tid");
    getByTestId("game-card-view-tid");
  });
});