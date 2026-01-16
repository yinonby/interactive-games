
import { render } from "@testing-library/react-native";
import React from "react";
import { useAppConfigModel } from "../../../app/model/rtk/AppConfigModel";
import { useUserConfigModel } from "../../../domains/user-config/model/rtk/UserConfigModel";
import { AvailableGamesView } from "./AvailableGamesView";

jest.mock("./MinimalGameCardView", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');

  return {
    MinimalGameCardView: View,
  };
});

jest.mock("../../../app/model/rtk/AppConfigModel", () => ({
  useAppConfigModel: jest.fn(),
}));

jest.mock("../../../domains/user-config/model/rtk/UserConfigModel", () => ({
  useUserConfigModel: jest.fn(),
}));

const mockUseAppConfigModel = useAppConfigModel as jest.Mock;
const mockUseUserConfigModel = useUserConfigModel as jest.Mock;

describe("AvailableGamesView", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("renders Loading when either model is loading", () => {
    mockUseAppConfigModel.mockReturnValue({ isLoading: true, isError: false, data: null });
    mockUseUserConfigModel.mockReturnValue({ isLoading: false, isError: false, data: null });

    const { getByText } = render(<AvailableGamesView />);
    expect(getByText("Loading")).toBeTruthy();
  });

  it("renders Error when either model has error", () => {
    mockUseAppConfigModel.mockReturnValue({ isLoading: false, isError: true, data: null });
    mockUseUserConfigModel.mockReturnValue({ isLoading: false, isError: false, data: null });

    const { getByText } = render(<AvailableGamesView />);
    expect(getByText("Error")).toBeTruthy();
  });

  it('renders "No games are available" when user has joined all available games', () => {
    const available = [{ gameConfigId: "g1" }, { gameConfigId: "g2" }];
    const userInfos = [{ minimalGameConfig: { gameConfigId: "g1" } }, { minimalGameConfig: { gameConfigId: "g2" } }];

    mockUseAppConfigModel.mockReturnValue({ isLoading: false, isError: false, data: { availableMinimalGameConfigs: available } });
    mockUseUserConfigModel.mockReturnValue({ isLoading: false, isError: false, data: { minimalGameInstanceExposedInfos: userInfos } });

    const { getByTestId, queryByTestId, getByText } = render(<AvailableGamesView />);
    expect(getByTestId("no-available-games-text-tid")).toBeTruthy();
    expect(getByText("No games are available")).toBeTruthy();
    expect(queryByTestId("grid-tid")).toBeNull();
  });

  it('renders "Available games:" and grid when there are non-joined games', () => {
    const available = [{ gameConfigId: "g1" }, { gameConfigId: "g2" }];
    const userInfos = [{ minimalGameConfig: { gameConfigId: "g1" } }];

    mockUseAppConfigModel.mockReturnValue({ isLoading: false, isError: false, data: { availableMinimalGameConfigs: available } });
    mockUseUserConfigModel.mockReturnValue({ isLoading: false, isError: false, data: { minimalGameInstanceExposedInfos: userInfos } });

    const { getByTestId, getByText } = render(<AvailableGamesView />);
    expect(getByTestId("available-games-text-tid")).toBeTruthy();
    expect(getByText("Available games:")).toBeTruthy();
    expect(getByTestId("grid-tid")).toBeTruthy();
    // ensure the unjoined game card is rendered
    expect(getByTestId("game-card-view-tid")).toBeTruthy();
  });
});