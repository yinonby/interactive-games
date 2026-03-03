
import { __engineAppUiMocks, type AppErrorCodeT } from '@ig/app-engine-ui';
import { buildMockedTranslation } from '@ig/app-engine-ui/test-utils';
import { buildGameConfigMock } from '@ig/games-engine-models/test-utils';
import { render } from '@testing-library/react-native';
import React from 'react';
import * as GameConfigsModelModule from '../../../domains/game-config/model/rtk/GameConfigsModel';
import { GamesTableView } from './GamesTableView';

// --------------------
// Mocks
// --------------------

jest.mock('./GamesTableRow', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');

  return {
    GamesTableRow: View
  };
});

// --------------------
// Tests
// --------------------

describe('GamesTableView', () => {
  const { onAppErrorMock } = __engineAppUiMocks;
  const spy_useGameConfigsModel = jest.spyOn(GameConfigsModelModule, 'useGameConfigsModel');

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders Loading when either model is loading", () => {
    spy_useGameConfigsModel.mockReturnValue({
      isLoading: true,
      isError: false,
      data: undefined
    });

    const { queryByTestId } = render(<GamesTableView joinedGameConfigIds={['GC1', 'GC2']} />);
    expect(queryByTestId("activity-indicator-tid")).toBeTruthy();
  });

  it("renders Error when games-config model has error", () => {
    spy_useGameConfigsModel.mockReturnValue({
      isLoading: false,
      isError: true,
      appErrCode: "ERR" as AppErrorCodeT,
      data: undefined
    });

    render(<GamesTableView joinedGameConfigIds={['GC1', 'GC2']} />);

    expect(onAppErrorMock).toHaveBeenCalledWith("ERR");
  });

  it('renders empty table', () => {
    spy_useGameConfigsModel.mockReturnValue({
      isLoading: false,
      isError: false,
      data: {
        publicGameConfigs: [],
      }
    });

    const { getAllByTestId, getByTestId, queryByTestId, getByText } = render(
      <GamesTableView joinedGameConfigIds={[]} />
    );

    getByTestId('RnuiTable-tid');
    getByTestId('RnuiTableHeader-tid');

    expect(getAllByTestId('RnuiTableTitle-tid')).toHaveLength(2);
    getByText(buildMockedTranslation("games:gameName"));

    expect(queryByTestId('GamesTableRow-tid')).toBeNull();
  });

  it('renders games list when games exist', () => {
    spy_useGameConfigsModel.mockReturnValue({
      isLoading: false,
      isError: false,
      data: {
        publicGameConfigs: [
          buildGameConfigMock(),
          buildGameConfigMock(),
        ],
      }
    });

    const { getAllByTestId, getByTestId } = render(
      <GamesTableView joinedGameConfigIds={['GC1', 'GC2']} />
    );

    getByTestId('RnuiTable-tid');
    getByTestId('RnuiTableHeader-tid');
    expect(getAllByTestId('RnuiTableTitle-tid')).toHaveLength(2);
    expect(getAllByTestId('GamesTableRow-tid')).toHaveLength(2);
  });
});
