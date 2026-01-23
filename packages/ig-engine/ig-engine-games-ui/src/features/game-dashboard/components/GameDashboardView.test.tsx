
import { __engineAppUiMocks } from '@ig/engine-app-ui';
import { buildTestGameConfig, buildTestMinimalGameInstanceExposedInfo } from '@ig/engine-models/test-utils';
import { render } from '@testing-library/react-native';
import React from 'react';
import * as GamesUserConfigModel from '../../../domains/user-config/model/rtk/GamesUserConfigModel';
import { GameDashboardView } from './GameDashboardView';

// mocks

jest.mock('./GameConfigCardView', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');

  return {
    GameConfigCardView: View,
  };
});

jest.mock('./GameInstanceView', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');

  return {
    GameInstanceView: View,
  };
});

// tests

describe('GameDashboardView', () => {
  const { onAppErrorMock } = __engineAppUiMocks;
  const useGamesUserConfigModelSpy = jest.spyOn(GamesUserConfigModel, 'useGamesUserConfigModel');

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading screen', () => {
    useGamesUserConfigModelSpy.mockReturnValue({
      isLoading: true,
      isError: false,
    });

    const joinedGameConfig = buildTestGameConfig({ gameName: 'g1' });
    const { queryByTestId } = render(
      <GameDashboardView joinedGameConfig={joinedGameConfig}/>
    );

    expect(queryByTestId("RnuiActivityIndicator-tid")).toBeTruthy();
  });

  it('renders error', () => {
    useGamesUserConfigModelSpy.mockReturnValue({
      isLoading: false,
      isError: true,
      appErrCode: "apiError:server",
    });

    const joinedGameConfig = buildTestGameConfig({ gameName: 'g1' });
    render(
      <GameDashboardView joinedGameConfig={joinedGameConfig}/>
    );

    expect(onAppErrorMock).toHaveBeenCalledWith("apiError:server");
  });

  it('renders properly', async () => {
    const joinedGameConfig = buildTestGameConfig({ gameName: 'g1' });
    useGamesUserConfigModelSpy.mockReturnValue({
      isLoading: false,
      isError: false,
      data: {
        gamesUserConfig: {
          joinedGameConfigs: [joinedGameConfig],
          minimalGameInstanceExposedInfos: [
            buildTestMinimalGameInstanceExposedInfo({}),
            buildTestMinimalGameInstanceExposedInfo({}),
          ]
        }
      },
    });

    const { getByTestId, getAllByTestId } = render(
      <GameDashboardView joinedGameConfig={joinedGameConfig}/>
    );

    getByTestId('GameConfigCardView-tid');
    expect(getAllByTestId('GameInstanceView-tid')).toHaveLength(2);
  });
});
