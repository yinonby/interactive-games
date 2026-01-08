
import type { GameInstanceIdT } from "@ig/engine-models";
import { __puiMocks } from "@ig/platform-ui";
import type { RnuiImagePropsT, RnuiImageSourceT } from "@ig/rnui";
import { act, fireEvent, render } from "@testing-library/react-native";
import React from "react";
import type { GameContextT } from "../../../app/layout/GameContextProvider";
import * as GameContextProvider from "../../../app/layout/GameContextProvider";
import type { UserConfigControllerT } from "../../../domains/user-config/controller/user-actions/UserConfigController";
import * as UserConfigController from "../../../domains/user-config/controller/user-actions/UserConfigController";
import type { GameImageTypeT } from "../../../types/GameImageTypes";
import type { GameUiUrlPathsAdapter } from "../../../types/GameUiConfigTypes";
import * as GameViewUtils from "../../../utils/GameViewUtils";
import { MinimalGameCardView } from "./MinimalGameCardView";

// Mock PriceView to render easily queryable output
jest.mock("./PriceView", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');

  return {
    PriceView: View,
  };
});

describe("MinimalGameCardView", () => {
  const { navigateMock } = __puiMocks;
  const onPlayGameMock = jest.fn();
  const useUserConfigControllerSpy = jest.spyOn(UserConfigController, "useUserConfigController");
  const getMinimalGameConfigImagePropsSpy = jest.spyOn(GameViewUtils, "getMinimalGameConfigImageProps");
  const useGameContextSpy = jest.spyOn(GameContextProvider, "useGameContext");

  const imagesSourceMap = {
    ["treasure-hunt-1"]: { uri: "http://example.com/cover.png" },
  } as Record<GameImageTypeT, RnuiImageSourceT>;
  const gameUiUrlPathsAdapter: GameUiUrlPathsAdapter = {
    buildGameInstanceDashboardUrlPath: (gameInstanceId: GameInstanceIdT) => `gi-dashboard-${gameInstanceId}`,
  } as GameUiUrlPathsAdapter;

  beforeEach(() => {
    jest.clearAllMocks();

    useGameContextSpy.mockReturnValue({
      imagesSourceMap: imagesSourceMap,
      gameUiUrlPathsAdapter: gameUiUrlPathsAdapter,
    } as GameContextT);
  });

  it("navigates to the game instance returned by onPlayGame when Play is pressed", async () => {
    useUserConfigControllerSpy.mockReturnValue({
      onPlayGame: onPlayGameMock,
      onAddGame: jest.fn(),
      onAcceptInvite: jest.fn(),
    } as UserConfigControllerT);

    onPlayGameMock.mockResolvedValue("game-instance-123");

    const { getByTestId } = render(
      <MinimalGameCardView
        minimalGameConfig={{
          gameConfigId: "cfg-1",
          kind: "joint-game",
          gameName: "Test Game",
          maxDurationMinutes: 30,
          maxParticipants: 4,
          imageAssetName: "treasure-hunt",
        }}
      />
    );

    const btn = getByTestId("play-game-btn-tid");
    await act(async () => {
      fireEvent.press(btn);
    });

    expect(onPlayGameMock).toHaveBeenCalledWith("cfg-1");
    expect(navigateMock).toHaveBeenCalledWith("gi-dashboard-game-instance-123");
  });

  it("doesn't navigates to the game instance when onPlayGame doesn't return gameInstanceId", async () => {
    useUserConfigControllerSpy.mockReturnValue({
      onPlayGame: onPlayGameMock,
      onAddGame: jest.fn(),
      onAcceptInvite: jest.fn(),
    } as UserConfigControllerT);

    onPlayGameMock.mockResolvedValue(null);

    const { getByTestId } = render(
      <MinimalGameCardView
        minimalGameConfig={{
          gameConfigId: "cfg-1",
          kind: "joint-game",
          gameName: "Test Game",
          maxDurationMinutes: 30,
          maxParticipants: 4,
          imageAssetName: "treasure-hunt",
        }}
      />
    );

    const btn = getByTestId("play-game-btn-tid");
    await act(async () => {
      fireEvent.press(btn);
    });

    expect(onPlayGameMock).toHaveBeenCalledWith("cfg-1");
    expect(navigateMock).not.toHaveBeenCalled();
  });

  it("should have no image", () => {
    useUserConfigControllerSpy.mockReturnValue({
      onPlayGame: onPlayGameMock,
      onAddGame: jest.fn(),
      onAcceptInvite: jest.fn(),
    } as UserConfigControllerT);
    getMinimalGameConfigImagePropsSpy.mockReturnValue(undefined);
    onPlayGameMock.mockResolvedValue("game-instance-123");

    const { getByTestId } = render(
      <MinimalGameCardView
        minimalGameConfig={{
          gameConfigId: "cfg-2",
          kind: "joint-game",
          gameName: "Free Game",
          maxDurationMinutes: 10,
          maxParticipants: 2,
          gamePrice: undefined,
        }}
      />
    );

    const card = getByTestId("game-card-view-tid");
    const imageProps = card.props["imageProps"];
    expect(imageProps).toBeUndefined();
  });

  it("should have an image", () => {
    getMinimalGameConfigImagePropsSpy.mockReturnValue({ imageSource: "fake-image-source" } as RnuiImagePropsT);
    useUserConfigControllerSpy.mockReturnValue({
      onPlayGame: onPlayGameMock,
      onAddGame: jest.fn(),
      onAcceptInvite: jest.fn(),
    } as UserConfigControllerT);
    onPlayGameMock.mockResolvedValue("game-instance-123");

    const { getByTestId } = render(
      <MinimalGameCardView
        minimalGameConfig={{
          gameConfigId: "cfg-2",
          kind: "joint-game",
          gameName: "Free Game",
          maxDurationMinutes: 10,
          maxParticipants: 2,
          imageUrl: "fake-url",
          gamePrice: undefined,
        }}
      />
    );

    const card = getByTestId("game-card-view-tid");
    const imageProps = card.props["imageProps"];
    expect(imageProps).not.toBeNull();
    expect(imageProps.imageSource).toBe("fake-image-source");
  });
});
