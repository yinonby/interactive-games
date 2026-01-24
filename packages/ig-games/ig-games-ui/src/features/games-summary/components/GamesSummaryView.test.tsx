
import { __engineAppUiMocks } from "@ig/engine-ui";
import { buildTestGameConfig } from '@ig/games-models/test-utils';
import { render } from '@testing-library/react-native';
import React from 'react';
import { buildMockedTranslation } from "../../../../test/mocks/EngineAppUiMocks";
import * as GamesUserConfigModel from "../../../domains/user-config/model/rtk/GamesUserConfigModel";
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

    const { queryByTestId } = render(
      <GamesSummaryView />
    );

    expect(queryByTestId("activity-indicator-tid")).toBeTruthy();
  });

  it('renders error', () => {
    useGamesUserConfigModelSpy.mockReturnValue({
      isLoading: false,
      isError: true,
      appErrCode: "apiError:server",
    });

    render(
      <GamesSummaryView />
    );

    expect(onAppErrorMock).toHaveBeenCalledWith("apiError:server");
  });

  it('renders empty state when there are no games', () => {
    useGamesUserConfigModelSpy.mockReturnValue({
      isLoading: false,
      isError: false,
      data: {
        gamesUserConfig: {
          joinedGameConfigs: [],
        }
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
    useGamesUserConfigModelSpy.mockReturnValue({
      isLoading: false,
      isError: false,
      data:  {
        gamesUserConfig: {
          joinedGameConfigs: [
            buildTestGameConfig({}),
            buildTestGameConfig({}),
          ],
        }
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
