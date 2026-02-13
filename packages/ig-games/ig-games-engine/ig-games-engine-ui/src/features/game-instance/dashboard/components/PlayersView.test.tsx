
import type { GameInstanceExposedInfoT, PlayerExposedInfoT } from '@ig/games-engine-models';
import { render } from '@testing-library/react-native';
import React from 'react';
import { buildMockedTranslation } from '../../../../../test/mocks/EngineAppUiMocks';
import { PlayersView } from './PlayersView';

jest.mock("./PlayersTableView", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');

  return {
    PlayersTableView: View,
  };
});

describe("PlayersView", () => {
  it("renders correctly", () => {
    const playerExposedInfos: PlayerExposedInfoT[] = [{
      playerAccountId: "userIdMock",
      playerRole: "admin",
    } as PlayerExposedInfoT];
    const gameInstanceExposedInfo: GameInstanceExposedInfoT = {
      playerExposedInfos: playerExposedInfos,
    } as GameInstanceExposedInfoT;

    // render
    const { getByTestId, getByText } = render(<PlayersView gameInstanceExposedInfo={gameInstanceExposedInfo} />);

    getByTestId("container-tid");
    getByTestId("players-text-tid");
    getByText(buildMockedTranslation("games:players"));

    const table = getByTestId("players-table-view-tid");
    expect(table.props.playerExposedInfos).toBe(playerExposedInfos);
  });
});