
import { __engineAppUiMocks } from '@ig/app-engine-ui';
import { buildMockedTranslation } from '@ig/app-engine-ui/test-utils';
import { render } from '@testing-library/react-native';
import React from 'react';
import * as GameUserModelModule from '../../../domains/game-user/model/rtk/GameUserModel';
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
  const spy_useGameUserModel = jest.spyOn(GameUserModelModule, 'useGameUserModel');

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading screen', () => {
    spy_useGameUserModel.mockReturnValue({
      isLoading: true,
      isError: false,
    });

    const { queryByTestId } = render(
      <GamesSummaryView />
    );

    expect(queryByTestId("activity-indicator-tid")).toBeTruthy();
  });

  it('renders error', () => {
    spy_useGameUserModel.mockReturnValue({
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
    spy_useGameUserModel.mockReturnValue({
      isLoading: false,
      isError: false,
      data: {
        publicGameUser: {
          gameUserId: 'USER1',
          joinedGameConfigIds: [],
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
    spy_useGameUserModel.mockReturnValue({
      isLoading: false,
      isError: false,
      data: {
        publicGameUser: {
          gameUserId: 'USER1',
          joinedGameConfigIds: ['GC1', 'GC2'],
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
