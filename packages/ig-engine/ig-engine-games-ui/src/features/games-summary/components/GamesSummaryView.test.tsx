
import { __engineAppUiMocks } from "@ig/engine-app-ui";
import { render } from '@testing-library/react-native';
import React from 'react';
import { buildMockedTranslation } from "../../../../test/mocks/EngineAppUiMocks";
import * as UserConfigModel from "../../../domains/user-config/model/rtk/UserConfigModel";
import { GamesSummaryView } from './GamesSummaryView';

// --------------------
// Mocks
// --------------------

jest.mock('./GamesTableView', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');

  return {
    GamesTableView: View
  };
});

// --------------------
// Tests
// --------------------

describe('GamesSummaryView', () => {
  const { onErrorMock } = __engineAppUiMocks;
  const useUserConfigModelSpy = jest.spyOn(UserConfigModel, 'useUserConfigModel');

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading screen', () => {
    useUserConfigModelSpy.mockReturnValue({
      isLoading: true,
      isError: false,
    });

    const { queryByTestId } = render(
      <GamesSummaryView />
    );

    expect(queryByTestId("activity-indicator-tid")).toBeTruthy();
  });

  it('renders error', () => {
    useUserConfigModelSpy.mockReturnValue({
      isLoading: false,
      isError: true,
      appErrCode: "apiError:server",
    });

    render(
      <GamesSummaryView />
    );

    expect(onErrorMock).toHaveBeenCalledWith("apiError:server");
  });

  it('renders empty state when there are no games', () => {
    useUserConfigModelSpy.mockReturnValue({
      isLoading: false,
      isError: false,
      data: {
        userId: "user-1",
        username: "username 1",
        minimalGameInstanceExposedInfos: []
      },
    });

    const { getByText, queryByTestId } = render(
      <GamesSummaryView />
    );

    getByText(buildMockedTranslation("games:userNoGamesAbailable"));
    expect(queryByTestId('current-games-card-tid')).toBeNull();
    expect(queryByTestId('current-games-table-view-tid')).toBeNull();
  });

  it('renders games list when games exist', () => {
    useUserConfigModelSpy.mockReturnValue({
      isLoading: false,
      isError: false,
      data:  {
        userId: "user-1",
        username: "username 1",
        minimalGameInstanceExposedInfos: [{
          gameInstanceId: "gid-1",
          invitationCode: "invt-code-gid-1",
          minimalGameConfig: {
            gameConfigId: "game-1",
            kind: "joint-game",
            gameName: 'Poker Night',
            maxDurationMinutes: 60,
            maxParticipants: 6,
          },
          playerRole: "admin",
          playerStatus: "playing",
          gameStatus: "in-process",
        }, {
          gameInstanceId: "gid-2",
          invitationCode: "invt-code-gid-2",
          minimalGameConfig: {
            gameConfigId: "game-2",
            kind: "joint-game",
            gameName: 'Chess Match',
            maxDurationMinutes: 60,
            maxParticipants: 6,
          },
          playerRole: "player",
          playerStatus: "playing",
          gameStatus: "in-process",
        }],
      },
    });

    const { getByText, queryByTestId } = render(
      <GamesSummaryView />
    );

    getByText(buildMockedTranslation("games:yourGames"));
    expect(queryByTestId('current-games-card-tid')).toBeTruthy();
    expect(queryByTestId('current-games-table-view-tid')).toBeTruthy();
  });
});
