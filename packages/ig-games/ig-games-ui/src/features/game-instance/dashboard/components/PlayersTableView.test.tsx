
import { __authUiMocks } from '@ig/auth-ui';
import { __engineAppUiMocks } from '@ig/engine-ui';
import type { PlayerExposedInfoT } from '@ig/games-models';
import { render } from "@testing-library/react-native";
import React from "react";
import { buildMockedTranslation } from "../../../../../test/mocks/EngineAppUiMocks";
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
  const { loggerErrorMock } = __engineAppUiMocks;
  const { useAuthMock } = __authUiMocks;

  // mock curUserId
  const curUserId = "userIdMock";
  useAuthMock.mockReturnValue({
    curUserId: curUserId,
  });

  it("does not render when current user is not in players list", () => {
    const playerExposedInfo: PlayerExposedInfoT = {
      playerUserId: "otherUserId",
      playerRole: 'player',
    } as PlayerExposedInfoT;
    const { queryByTestId } = render(
      <PlayersTableView playerExposedInfos={[playerExposedInfo]} />
    );

    // verify calls
    expect(loggerErrorMock).toHaveBeenCalled();

    // verify components
    expect(queryByTestId("table-tid")).toBeNull();
  });

  it("renders component properly withAdminButtons = false", () => {
    const playerExposedInfo: PlayerExposedInfoT = {
      playerUserId: curUserId,
      playerRole: 'admin',
    } as PlayerExposedInfoT;
    const { getByTestId, getAllByTestId, queryAllByTestId, getByText } = render(
      <PlayersTableView playerExposedInfos={[playerExposedInfo]} withAdminButtons={false} />
    );

    getByTestId("table-tid");
    getByTestId("table-header-tid");

    const tableTitles = getAllByTestId("table-title-tid");
    expect(tableTitles).toHaveLength(3);
    getByText(buildMockedTranslation("common:nickname"));
    getByText(buildMockedTranslation("common:role"));
    getByText(buildMockedTranslation("common:status"));

    const playerRows = queryAllByTestId("player-row-tid");
    expect(playerRows).toHaveLength(1);
  });

  it("renders component properly, withAdminButtons = true, no admin", () => {
    const playerExposedInfo: PlayerExposedInfoT = {
      playerUserId: curUserId,
      playerRole: 'player',
    } as PlayerExposedInfoT;
    const { getByTestId, getAllByTestId, queryAllByTestId, getByText } = render(
      <PlayersTableView playerExposedInfos={[playerExposedInfo]} />
    );

    getByTestId("table-tid");
    getByTestId("table-header-tid");

    const tableTitles = getAllByTestId("table-title-tid");
    expect(tableTitles).toHaveLength(3);
    getByText(buildMockedTranslation("common:nickname"));
    getByText(buildMockedTranslation("common:role"));
    getByText(buildMockedTranslation("common:status"));

    const playerRows = queryAllByTestId("player-row-tid");
    expect(playerRows).toHaveLength(1);
  });

  it("renders component properly, withAdminButtons = true, admin", () => {
    const playerExposedInfo: PlayerExposedInfoT = {
      playerUserId: curUserId,
      playerRole: 'admin',
    } as PlayerExposedInfoT;
    const { getByTestId, getAllByTestId, queryAllByTestId, getByText } = render(
      <PlayersTableView playerExposedInfos={[playerExposedInfo]} withAdminButtons />
    );

    getByTestId("table-tid");
    getByTestId("table-header-tid");

    const tableTitles = getAllByTestId("table-title-tid");
    expect(tableTitles).toHaveLength(4);
    getByText(buildMockedTranslation("common:nickname"));
    getByText(buildMockedTranslation("common:role"));
    getByText(buildMockedTranslation("common:status"));

    const playerRows = queryAllByTestId("player-row-tid");
    expect(playerRows).toHaveLength(1);
  });

  it("renders component properly, multiple players", () => {
    const playerExposedInfo1: PlayerExposedInfoT = {
      playerUserId: curUserId,
      playerRole: 'admin',
    } as PlayerExposedInfoT;
    const playerExposedInfo2: PlayerExposedInfoT = {
      playerUserId: 'otherUserId',
      playerRole: 'player',
    } as PlayerExposedInfoT;
    const { queryAllByTestId } = render(
      <PlayersTableView playerExposedInfos={[playerExposedInfo1, playerExposedInfo2]} />
    );

    const playerRows = queryAllByTestId("player-row-tid");
    expect(playerRows).toHaveLength(2);
  });
});
