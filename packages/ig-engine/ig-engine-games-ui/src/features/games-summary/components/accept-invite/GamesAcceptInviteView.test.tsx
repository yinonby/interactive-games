
import { __engineAppUiMocks } from "@ig/engine-app-ui";
import { __puiMocks } from "@ig/platform-ui";
import { render, waitFor } from "@testing-library/react-native";
import React from "react";
import { useUserConfigController } from "../../../../domains/user-config/controller/user-actions/UserConfigController";
import { GamesAcceptInviteView } from "./GamesAcceptInviteView";

// mocks

jest.mock("../../../../domains/user-config/controller/user-actions/UserConfigController", () => ({
  useUserConfigController: jest.fn(),
}));

// tests

describe("GamesAcceptInviteView", () => {
  const { navigateReplaceMock } = __puiMocks;
  const onAcceptInviteMock = jest.fn();
  const { loggerErrorMock } = __engineAppUiMocks;

  beforeEach(() => {
    jest.clearAllMocks();

    (useUserConfigController as jest.Mock).mockReturnValue({
      onAcceptInvite: onAcceptInviteMock,
    });
  });

  it("renders activity indicator and message", async () => {
    onAcceptInviteMock.mockResolvedValueOnce("giid-123");
    const { getByTestId } = render(<GamesAcceptInviteView invitationCode="INV-1" />);

    expect(getByTestId("activity-indicator-tid")).toBeTruthy();
    expect(getByTestId("activity-message-tid")).toBeTruthy();
  });

  it("calls onAcceptInvite and navigates to game when accept succeeds", async () => {
    onAcceptInviteMock.mockResolvedValueOnce("giid-123");
    render(<GamesAcceptInviteView invitationCode="INV-1" />);

    await waitFor(() =>
      expect(navigateReplaceMock).toHaveBeenCalledWith("mockedPathGamesInstance/giid-123")
    );

    expect(onAcceptInviteMock).toHaveBeenCalledWith("INV-1");
  });

  it("logs error and navigates to games list when accept returns null", async () => {
    onAcceptInviteMock.mockResolvedValueOnce(null);
    render(<GamesAcceptInviteView invitationCode="INV-2" />);

    await waitFor(() =>
      expect(navigateReplaceMock).toHaveBeenCalledWith("mockedPathGamesDashboard")
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