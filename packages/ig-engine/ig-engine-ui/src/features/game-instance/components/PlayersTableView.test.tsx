
import { render } from "@testing-library/react-native";
import React from "react";
import { PlayersTableView } from "./PlayersTableView";

// mocks

jest.mock('./PlayerTableRow', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');

  return {
    PlayerTableRow: View,
  };
});

// tests

describe("PlayersTableView", () => {
  it("renders component properly, no admin, no players", () => {
    const { getByTestId, getAllByTestId, queryAllByTestId } = render(
      <PlayersTableView isPlayerAdmin={false} otherPlayerExposedInfos={[]} />
    );

    const table = getByTestId("table-tid");
    expect(table).toBeTruthy();

    const tableHeader = getByTestId("table-header-tid");
    expect(tableHeader).toBeTruthy();

    const tableTitles = getAllByTestId("table-title-tid");
    expect(tableTitles).toHaveLength(3);

    const playerRows = queryAllByTestId("player-row-tid");
    expect(playerRows).toHaveLength(0);
  });

  it("renders component properly, admin, no players", () => {
    const { getByTestId, getAllByTestId, queryAllByTestId } = render(
      <PlayersTableView isPlayerAdmin={true} otherPlayerExposedInfos={[]} />
    );

    const table = getByTestId("table-tid");
    expect(table).toBeTruthy();

    const tableHeader = getByTestId("table-header-tid");
    expect(tableHeader).toBeTruthy();

    const tableTitles = getAllByTestId("table-title-tid");
    expect(tableTitles).toHaveLength(4);

    const playerRows = queryAllByTestId("player-row-tid");
    expect(playerRows).toHaveLength(0);
  });

  it("renders component properly, admin, with players", () => {
    const { getAllByTestId, getByTestId } = render(
      <PlayersTableView
        isPlayerAdmin={true}
        otherPlayerExposedInfos={[{
          playerUserId: "p1",
          playerNickname: "Player 1",
          playerRole: "player",
          playerStatus: "playing",
        }]}
      />
    );

    const table = getByTestId("table-tid");
    expect(table).toBeTruthy();

    const tableHeader = getByTestId("table-header-tid");
    expect(tableHeader).toBeTruthy();

    const tableTitles = getAllByTestId("table-title-tid");
    expect(tableTitles).toHaveLength(4);

    const playerRows = getAllByTestId("player-row-tid");
    expect(playerRows).toHaveLength(1);
  });
});
