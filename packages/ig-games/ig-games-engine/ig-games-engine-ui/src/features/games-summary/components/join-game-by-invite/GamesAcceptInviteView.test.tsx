
import { __engineAppUiMocks } from '@ig/app-engine-ui';
import { __puiMocks } from '@ig/platform-ui';
import { render, waitFor } from '@testing-library/react-native';
import React from 'react';
import type { GameInstanceControllerT } from '../../../../domains/game-instance/controller/user-actions/GameInstanceController';
import * as GameInstanceControllerModule from '../../../../domains/game-instance/controller/user-actions/GameInstanceController';
import { GamesAcceptInviteView } from './GamesAcceptInviteView';

// tests

describe("GamesAcceptInviteView", () => {
  const {
    onUnknownErrorMock,
    buildGamesDashboardUrlPathMock,
    buildGameInstanceDashboardUrlPathMock,
  } = __engineAppUiMocks;
  const { navigateReplaceMock } = __puiMocks;
  const mock_onJoinGameByInvite = jest.fn();
  const spy_useGameInstanceController = jest.spyOn(GameInstanceControllerModule, 'useGameInstanceController');

  beforeEach(() => {
    jest.clearAllMocks();

    spy_useGameInstanceController.mockReturnValue({
      onJoinGameByInvite: mock_onJoinGameByInvite,
    } as unknown as GameInstanceControllerT);
  });

  it("renders activity indicator and message", async () => {
    mock_onJoinGameByInvite.mockResolvedValueOnce("giid-123");
    const { getByTestId } = render(<GamesAcceptInviteView invitationCode="INV-1" />);

    getByTestId("activity-indicator-tid");
    getByTestId("activity-message-tid");
  });

  it("does nothing when invitationCode is falsy", async () => {
    mock_onJoinGameByInvite.mockImplementation(async () => { });
    buildGameInstanceDashboardUrlPathMock.mockReturnValue('mockedUrl');

    render(<GamesAcceptInviteView invitationCode={""} />);

    await Promise.resolve();

    expect(mock_onJoinGameByInvite).not.toHaveBeenCalled();
    expect(navigateReplaceMock).not.toHaveBeenCalled();
    expect(onUnknownErrorMock).not.toHaveBeenCalled();
  });

  it("calls onAcceptInvite and navigates to game when accept succeeds", async () => {
    mock_onJoinGameByInvite.mockResolvedValueOnce("giid-123");
    buildGameInstanceDashboardUrlPathMock.mockReturnValue('mockedUrl');

    render(<GamesAcceptInviteView invitationCode="ABC123" />);

    await waitFor(() => {
      expect(mock_onJoinGameByInvite).toHaveBeenCalledWith('ABC123');
    });

    expect(buildGameInstanceDashboardUrlPathMock).toHaveBeenCalledWith("giid-123");
    expect(mock_onJoinGameByInvite).toHaveBeenCalledWith("ABC123");
    expect(navigateReplaceMock).toHaveBeenCalledWith("mockedUrl")
  });

  it("calls onAcceptInvite and handles failure", async () => {
    mock_onJoinGameByInvite.mockRejectedValueOnce(new Error("Invite failed"));
    buildGamesDashboardUrlPathMock.mockReturnValue('mockedUrl');

    render(<GamesAcceptInviteView invitationCode="ABC123" />);


    await waitFor(() => {
      expect(mock_onJoinGameByInvite).toHaveBeenCalledWith('ABC123');
    });

    expect(onUnknownErrorMock).toHaveBeenCalled();
    expect(buildGamesDashboardUrlPathMock).toHaveBeenCalled();
    expect(navigateReplaceMock).toHaveBeenCalledWith('mockedUrl');
  });
});