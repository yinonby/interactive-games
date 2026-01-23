
import { __engineAppUiMocks } from "@ig/engine-app-ui";
import { __puiMocks } from "@ig/platform-ui";
import { render, waitFor } from "@testing-library/react-native";
import React from "react";
import * as GamesUserConfigController from "../../../../domains/user-config/controller/user-actions/GamesUserConfigController";
import { GamesAcceptInviteView } from "./GamesAcceptInviteView";

// tests

describe("GamesAcceptInviteView", () => {
  const {
    onUnknownErrorMock,
    buildGamesDashboardUrlPathMock,
    buildGameInstanceDashboardUrlPathMock,
  } = __engineAppUiMocks;
  const { navigateReplaceMock } = __puiMocks;
  const onAcceptInviteMock = jest.fn();
  const useGamesUserConfigControllerSpy = jest.spyOn(GamesUserConfigController, 'useGamesUserConfigController');

  beforeEach(() => {
    jest.clearAllMocks();

    useGamesUserConfigControllerSpy.mockReturnValue({
      onPlayGame: jest.fn(),
      onAcceptInvite: onAcceptInviteMock,
      onAddGameInstance: jest.fn(),
    });
  });

  it("renders activity indicator and message", async () => {
    onAcceptInviteMock.mockResolvedValueOnce("giid-123");
    const { getByTestId } = render(<GamesAcceptInviteView invitationCode="INV-1" />);

    getByTestId("activity-indicator-tid");
    getByTestId("activity-message-tid");
  });

  it("does nothing when invitationCode is falsy", async () => {
    onAcceptInviteMock.mockImplementation(async () => { });
    buildGameInstanceDashboardUrlPathMock.mockReturnValue('mockedUrl');

    render(<GamesAcceptInviteView invitationCode={""} />);

    await Promise.resolve();

    expect(onAcceptInviteMock).not.toHaveBeenCalled();
    expect(navigateReplaceMock).not.toHaveBeenCalled();
    expect(onUnknownErrorMock).not.toHaveBeenCalled();
  });

  it("calls onAcceptInvite and navigates to game when accept succeeds", async () => {
    onAcceptInviteMock.mockResolvedValueOnce("giid-123");
    buildGameInstanceDashboardUrlPathMock.mockReturnValue('mockedUrl');

    render(<GamesAcceptInviteView invitationCode="ABC123" />);

    await waitFor(() => {
      expect(onAcceptInviteMock).toHaveBeenCalledWith('ABC123');
    });

    expect(buildGameInstanceDashboardUrlPathMock).toHaveBeenCalledWith("giid-123");
    expect(onAcceptInviteMock).toHaveBeenCalledWith("ABC123");
    expect(navigateReplaceMock).toHaveBeenCalledWith("mockedUrl")
  });

  it("calls onAcceptInvite and handles failure", async () => {
    onAcceptInviteMock.mockRejectedValueOnce(new Error("Invite failed"));
    buildGamesDashboardUrlPathMock.mockReturnValue('mockedUrl');

    render(<GamesAcceptInviteView invitationCode="ABC123" />);


    await waitFor(() => {
      expect(onAcceptInviteMock).toHaveBeenCalledWith('ABC123');
    });

    expect(onUnknownErrorMock).toHaveBeenCalled();
    expect(buildGamesDashboardUrlPathMock).toHaveBeenCalled();
    expect(navigateReplaceMock).toHaveBeenCalledWith('mockedUrl');
  });
});