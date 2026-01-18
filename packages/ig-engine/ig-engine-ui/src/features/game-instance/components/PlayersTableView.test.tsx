
import { render } from "@testing-library/react-native";
import React from "react";
import { buildMockedTranslation } from "../../../app/localization/__mocks__/AppLocalizationProvider";
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
    const { getByTestId, getAllByTestId, queryAllByTestId, getByText } = render(
      <PlayersTableView isPlayerAdmin={false} otherPlayerExposedInfos={[]} />
    );

    getByTestId("table-tid");
    getByTestId("table-header-tid");

    const tableTitles = getAllByTestId("table-title-tid");
    expect(tableTitles).toHaveLength(3);
    getByText(buildMockedTranslation("common:nickname"));
    getByText(buildMockedTranslation("common:role"));
    getByText(buildMockedTranslation("common:status"));

    const playerRows = queryAllByTestId("player-row-tid");
    expect(playerRows).toHaveLength(0);
  });

  it("renders component properly, admin, no players", () => {
    const { getByTestId, getAllByTestId, queryAllByTestId } = render(
      <PlayersTableView isPlayerAdmin={true} otherPlayerExposedInfos={[]} />
    );

    getByTestId("table-tid");
    getByTestId("table-header-tid");

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

    getByTestId("table-tid");
    getByTestId("table-header-tid");

    const tableTitles = getAllByTestId("table-title-tid");
    expect(tableTitles).toHaveLength(4);

    const playerRows = getAllByTestId("player-row-tid");
    expect(playerRows).toHaveLength(1);
  });
});
