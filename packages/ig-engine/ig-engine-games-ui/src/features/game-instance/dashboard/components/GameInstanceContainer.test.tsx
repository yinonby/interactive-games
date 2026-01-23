
import { __engineAppUiMocks } from "@ig/engine-app-ui";
import { type GameInstanceExposedInfoT, type GameInstanceIdT } from "@ig/engine-models";
import { buildTestGameInstanceExposedInfo } from '@ig/engine-models/test-utils';
import { render } from '@testing-library/react-native';
import React from 'react';
import * as GameInstanceModel from "../../../../domains/game-instance/model/rtk/GameInstanceModel";
import { GameInstanceContainer } from "./GameInstanceContainer";

jest.mock('./GameInstanceView', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');

  return {
    GameInstanceView: View
  };
});

describe('GameInstanceView', () => {
  const { onAppErrorMock } = __engineAppUiMocks;
  const useGameInstanceModelSpy = jest.spyOn(GameInstanceModel, 'useGameInstanceModel');
  const gameInstanceId1: GameInstanceIdT = "gid-1";

  it('renders loading view', () => {
    useGameInstanceModelSpy.mockReturnValue({
      isLoading: true,
      isError: false,
    });

    const { queryByTestId } = render(
      <GameInstanceContainer gameInstanceId={gameInstanceId1} />
    );

    expect(queryByTestId("RnuiActivityIndicator-tid")).toBeTruthy();
  });

  it('renders error', () => {
    useGameInstanceModelSpy.mockReturnValue({
      isLoading: false,
      isError: true,
      appErrCode: "apiError:server",
    });

    render(
      <GameInstanceContainer gameInstanceId={gameInstanceId1} />
    );

    expect(onAppErrorMock).toHaveBeenCalledWith("apiError:server");
  });

  it('renders correctly when there is data', () => {
    const gameInstanceExposedInfo: GameInstanceExposedInfoT = buildTestGameInstanceExposedInfo({
      gameInstanceId: gameInstanceId1,
    });

    useGameInstanceModelSpy.mockReturnValue({
      isLoading: false,
      isError: false,
      data: {
        gameInstanceExposedInfo: gameInstanceExposedInfo,
        gameInstanceChatMessages: [],
      },
    });

    const { getByTestId } = render(
      <GameInstanceContainer gameInstanceId={gameInstanceId1} />
    );

    const view = getByTestId("GameInstanceView-tid");
    expect(view.props.gameInstanceExposedInfo).toEqual({ gameInstanceId: gameInstanceId1 });
    expect(view.props.gameInstanceChatMessages).toEqual([]);
  });
});
