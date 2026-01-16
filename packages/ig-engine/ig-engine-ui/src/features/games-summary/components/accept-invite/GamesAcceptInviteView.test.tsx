
import type { GameInstanceIdT } from "@ig/engine-models";
import { __puiMocks } from "@ig/platform-ui";
import type { RnuiImageSourceT } from "@ig/rnui";
import { render, waitFor } from "@testing-library/react-native";
import React from "react";
import * as GameContextProvider from "../../../../app/layout/GameContextProvider";
import { useClientLogger } from "../../../../app/providers/useClientLogger";
import { useUserConfigController } from "../../../../domains/user-config/controller/user-actions/UserConfigController";
import type { GameImageTypeT } from "../../../../types/GameImageTypes";
import type { GameUiUrlPathsAdapter } from "../../../../types/GameUiConfigTypes";
import { GamesAcceptInviteView } from "./GamesAcceptInviteView";

// mocks

jest.mock(
  "../../../../domains/user-config/controller/user-actions/UserConfigController",
  () => ({
    useUserConfigController: jest.fn(),
  })
);

jest.mock("../../../../app/providers/useClientLogger", () => ({
  useClientLogger: jest.fn(),
}));

// tests

describe("GamesAcceptInviteView", () => {
  const { navigateReplaceMock } = __puiMocks;
  const onAcceptInviteMock = jest.fn();
  const loggerErrorMock = jest.fn();
  const useGameContextSpy = jest.spyOn(GameContextProvider, "useGameContext");

  const imagesSourceMap = {
    ["treasure-hunt-1"]: { uri: "http://example.com/cover.png" },
  } as Record<GameImageTypeT, RnuiImageSourceT>;
  const gameUiUrlPathsAdapter: GameUiUrlPathsAdapter = {
    buildGameInstanceDashboardUrlPath: (gameInstanceId: GameInstanceIdT) => `gi-dashboard-${gameInstanceId}`,
    buildGamesDashboardUrlPath: () => "games-dashboard-fake-url",
  } as GameUiUrlPathsAdapter;

  beforeEach(() => {
    jest.clearAllMocks();
    (useUserConfigController as jest.Mock).mockReturnValue({
      onAcceptInvite: onAcceptInviteMock,
    });
    (useClientLogger as jest.Mock).mockReturnValue({
      error: loggerErrorMock,
    });

    useGameContextSpy.mockReturnValue({
      imagesSourceMap: imagesSourceMap,
      gameUiUrlPathsAdapter: gameUiUrlPathsAdapter,
    } as GameContextProvider.GameContextT);
  });

  it("calls onAcceptInvite and navigates to game when accept succeeds", async () => {
    onAcceptInviteMock.mockResolvedValueOnce("giid-123");
    render(<GamesAcceptInviteView invitationCode="INV-1" />);

    await waitFor(() =>
      expect(navigateReplaceMock).toHaveBeenCalledWith("gi-dashboard-giid-123")
    );

    expect(onAcceptInviteMock).toHaveBeenCalledWith("INV-1");
  });

  it("logs error and navigates to games list when accept returns null", async () => {
    onAcceptInviteMock.mockResolvedValueOnce(null);
    render(<GamesAcceptInviteView invitationCode="INV-2" />);

    await waitFor(() =>
      expect(navigateReplaceMock).toHaveBeenCalledWith("games-dashboard-fake-url")
    );

    expect(loggerErrorMock).toHaveBeenCalled();
    const errArg = loggerErrorMock.mock.calls[0][0];
    expect(errArg).toBeInstanceOf(Error);
    expect(errArg.message).toBe("Invite failed");
  });

  it("does nothing when invitationCode is falsy", async () => {
    render(<GamesAcceptInviteView invitationCode={""} />);

    // give a tick to ensure no async work started
    await Promise.resolve();

    expect(onAcceptInviteMock).not.toHaveBeenCalled();
    expect(navigateReplaceMock).not.toHaveBeenCalled();
    expect(loggerErrorMock).not.toHaveBeenCalled();
  });
});