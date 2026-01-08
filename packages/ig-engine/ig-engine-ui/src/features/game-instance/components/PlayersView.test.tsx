
import type { GameInstanceExposedInfoT } from "@ig/engine-models";
import { render } from '@testing-library/react-native';
import React from "react";
import { PlayersView } from "./PlayersView";

jest.mock("./PlayersTableView", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');

  return {
    PlayersTableView: View,
  };
});

describe("PlayersView", () => {
  it('renders "No players" when otherPlayerExposedInfos is empty', () => {
    const gameInstanceExposedInfo: GameInstanceExposedInfoT = {
      playerRole: "admin",
      otherPlayerExposedInfos: [],
    } as unknown as GameInstanceExposedInfoT;

    const { queryByTestId } = render(<PlayersView gameInstanceExposedInfo={gameInstanceExposedInfo} />);

    const noPlayers = queryByTestId("no-players-text-tid");
    expect(noPlayers).not.toBeNull();
    expect(noPlayers.children).toContain("No players");
  });

  it("renders heading and PlayersTableView when players are present and passes props (admin)", () => {
    const otherPlayerExposedInfos = [{ id: "p1", name: "Alice" }];
    const gameInstanceExposedInfo: GameInstanceExposedInfoT = {
      playerRole: "admin",
      otherPlayerExposedInfos: otherPlayerExposedInfos,
    } as unknown as GameInstanceExposedInfoT;
    const { queryByTestId } = render(<PlayersView gameInstanceExposedInfo={gameInstanceExposedInfo} />);

    const heading = queryByTestId("players-text-tid");
    expect(heading).not.toBeNull();
    expect(heading.children).toContain("Players");

    const table = queryByTestId("players-table-view-tid");
    expect(table).not.toBeNull();
    expect(table.props.isPlayerAdmin).toBe(true);
    expect(table.props.otherPlayerExposedInfos).toBe(otherPlayerExposedInfos);
  });

  it("passes isPlayerAdmin = false when playerRole is not admin", () => {
    const otherPlayerExposedInfos = [{ id: "p1", name: "Alice" }];
    const gameInstanceExposedInfo: GameInstanceExposedInfoT = {
      playerRole: "player",
      otherPlayerExposedInfos: otherPlayerExposedInfos,
    } as unknown as GameInstanceExposedInfoT;
    const { queryByTestId } = render(<PlayersView gameInstanceExposedInfo={gameInstanceExposedInfo} />);

    const heading = queryByTestId("players-text-tid");
    expect(heading).not.toBeNull();
    expect(heading.children).toContain("Players");

    const table = queryByTestId("players-table-view-tid");
    expect(table).not.toBeNull();
    expect(table.props.isPlayerAdmin).toBe(false);
    expect(table.props.otherPlayerExposedInfos).toBe(otherPlayerExposedInfos);
  });
});