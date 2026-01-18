
import type { GameInstanceExposedInfoT, GameInstanceIdT } from "@ig/engine-models";
import { render } from '@testing-library/react-native';
import React from 'react';
import * as GameInstanceModel from "../../../domains/game-instance/model/rtk/GameInstanceModel";
import { GameInstanceContainer } from "./GameInstanceContainer";

jest.mock('./GameInstanceView', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');

  return {
    GameInstanceView: () => (
      <View testID="GameInstanceView-tid" />
    ),
  };
});

describe('GameInstanceView', () => {
  const useGameInstanceModelSpy = jest.spyOn(GameInstanceModel, 'useGameInstanceModel');
  const gameInstanceId1: GameInstanceIdT = "gid-1";

  it('renders loading screen', () => {
    useGameInstanceModelSpy.mockReturnValue({
      isLoading: true,
      isError: false,
    });

    const { queryByTestId } = render(
      <GameInstanceContainer gameInstanceId={gameInstanceId1} />
    );

    expect(queryByTestId("activity-indicator-tid")).toBeTruthy();
  });

  it('renders error', () => {
    useGameInstanceModelSpy.mockReturnValue({
      isLoading: false,
      isError: true,
      appErrCode: "apiError:server",
    });

    const { getByText } = render(
      <GameInstanceContainer gameInstanceId={gameInstanceId1} />
    );

    expect(
      getByText("Error")
    ).toBeTruthy();
  });

  it('renders empty state when there are no games', () => {
    const gameInstanceExposedInfo: GameInstanceExposedInfoT = {
      gameInstanceId: gameInstanceId1,
      invitationCode: gameInstanceId1,
      gameConfig: {
        gameConfigId: "treasure-hunt-1",
        kind: "joint-game",
        gameName: "Treasure Hunt 1",
        maxDurationMinutes: 60,
        maxParticipants: 6,
        extraTimeMinutes: 10,
        extraTimeLimitMinutes: 20,
        levelConfigs: [],
      },
      playerRole: "admin",
      playerStatus: "playing",
      gameStatus: "in-process",
      otherPlayerExposedInfos: [],
    }

    useGameInstanceModelSpy.mockReturnValue({
      isLoading: false,
      isError: false,
      data: {
        gameInstanceExposedInfo: gameInstanceExposedInfo,
        gameInstanceChatMessages: [],
      },
    });

    const { queryByTestId } = render(
      <GameInstanceContainer gameInstanceId={gameInstanceId1} />
    );

    expect(
      queryByTestId("GameInstanceView-tid")
    ).toBeTruthy();
  });
});
