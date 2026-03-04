
import { type GameInstanceIdT, type PublicGameInstanceT } from '@ig/games-engine-models';
import { buildTestGameInstanceExposedInfo } from '@ig/games-engine-models/test-utils';
import { render } from '@testing-library/react-native';
import React from 'react';
import * as GameInstanceModel from '../../../../domains/game-instance/model/rtk/GameInstanceModel';
import { GameInstanceContainer } from './GameInstanceContainer';

jest.mock('../../../../features/common/ModelLoadingView', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');

  return {
    ModelLoadingView: View,
  };
});

jest.mock('./GameInstanceView', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');

  return {
    GameInstanceView: View
  };
});

describe('GameInstanceView', () => {
  const useGameInstanceModelSpy = jest.spyOn(GameInstanceModel, 'useGameInstanceModel');
  const gameInstanceId1: GameInstanceIdT = "gid-1";

  it('renders ModelLoadingView when loading', () => {
    useGameInstanceModelSpy.mockReturnValue({
      isLoading: true,
      isError: false,
    });

    const { getByTestId } = render(
      <GameInstanceContainer gameInstanceId={gameInstanceId1} />
    );

    getByTestId("ModelLoadingView-tid");
  });

  it('renders ModelLoadingView when error', () => {
    useGameInstanceModelSpy.mockReturnValue({
      isLoading: false,
      isError: true,
      appErrCode: "apiError:server",
    });

    const { getByTestId } = render(
      <GameInstanceContainer gameInstanceId={gameInstanceId1} />
    );

    getByTestId("ModelLoadingView-tid");
  });

  it('renders correctly when there is data', () => {
    const publicGameInstance: PublicGameInstanceT = buildTestGameInstanceExposedInfo({
      gameInstanceId: gameInstanceId1,
    });

    useGameInstanceModelSpy.mockReturnValue({
      isLoading: false,
      isError: false,
      data: {
        publicGameInstance: publicGameInstance,
      },
    });

    const { getByTestId } = render(
      <GameInstanceContainer gameInstanceId={gameInstanceId1} />
    );

    const view = getByTestId("GameInstanceView-tid");
    expect(view.props.publicGameInstance).toEqual({ gameInstanceId: gameInstanceId1 });
  });
});
