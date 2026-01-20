
import { __puiMocks } from "@ig/platform-ui";
import type { RnuiImagePropsT } from "@ig/rnui";
import { act, fireEvent, render } from "@testing-library/react-native";
import React from "react";
import { buildMockedTranslation } from "../../../../test/mocks/EngineAppUiMocks";
import type { UserConfigControllerT } from "../../../domains/user-config/controller/user-actions/UserConfigController";
import * as UserConfigController from "../../../domains/user-config/controller/user-actions/UserConfigController";
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

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly", async () => {
    useUserConfigControllerSpy.mockReturnValue({
      onPlayGame: onPlayGameMock,
      onAddGame: jest.fn(),
      onAcceptInvite: jest.fn(),
    } as UserConfigControllerT);

    onPlayGameMock.mockResolvedValue("game-instance-123");

    const { getByText } = render(
      <MinimalGameCardView
        minimalGameConfig={{
          gameConfigId: "cfg-1",
          kind: "joint-game",
          gameName: "Test Game",
          maxDurationMinutes: 30,
          gamePrice: "free",
          maxParticipants: 4,
          imageAssetName: "treasure-hunt-1",
        }}
      />
    );

    getByText(buildMockedTranslation("common:duration") + ": " + buildMockedTranslation("common:minutes"));
    getByText(buildMockedTranslation("games:maxParticipants") + ": 4");
    getByText(buildMockedTranslation("common:price") + ": ");
    getByText(buildMockedTranslation("games:play"));
  });

  it("navigates to the game instance returned by onPlayGame when Play is pressed", async () => {
    useUserConfigControllerSpy.mockReturnValue({
      onPlayGame: onPlayGameMock,
      onAddGame: jest.fn(),
      onAcceptInvite: jest.fn(),
    } as UserConfigControllerT);

    onPlayGameMock.mockResolvedValue("giid-123");

    const { getByTestId } = render(
      <MinimalGameCardView
        minimalGameConfig={{
          gameConfigId: "cfg-1",
          kind: "joint-game",
          gameName: "Test Game",
          maxDurationMinutes: 30,
          gamePrice: "free",
          maxParticipants: 4,
          imageAssetName: "treasure-hunt-1",
        }}
      />
    );

    const btn = getByTestId("play-game-btn-tid");
    await act(async () => {
      fireEvent.press(btn);
    });

    expect(onPlayGameMock).toHaveBeenCalledWith("cfg-1");
    expect(navigateMock).toHaveBeenCalledWith("mockedPathGamesInstance/giid-123");
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
          gamePrice: "free",
          maxParticipants: 4,
          imageAssetName: "treasure-hunt-1",
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
          gamePrice: "free",
          maxParticipants: 2,
          imageAssetName: "escape-room-1",
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
          gamePrice: "free",
          maxParticipants: 2,
          imageUrl: "fake-url",
        }}
      />
    );

    const card = getByTestId("game-card-view-tid");
    const imageProps = card.props["imageProps"];
    expect(imageProps).not.toBeNull();
    expect(imageProps.imageSource).toBe("fake-image-source");
  });
});
