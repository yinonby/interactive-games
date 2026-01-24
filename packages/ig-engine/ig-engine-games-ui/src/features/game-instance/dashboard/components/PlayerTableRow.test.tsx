
import type { PlayerExposedInfoT } from "@ig/engine-models";
import { fireEvent, render } from '@testing-library/react-native';
import React, { act } from "react";
import { buildMockedTranslation } from "../../../../../test/mocks/EngineAppUiMocks";
import { PlayerTableRow } from "./PlayerTableRow";

jest.mock("./PlayersTableView", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');

  return {
    PlayersTableView: View,
  };
});

describe("PlayerTableRow", () => {
  it("renders row and cells, withAdminButtons = false", () => {
    const otherPlayerExposedInfo: PlayerExposedInfoT = {
      playerUserId: "p1",
      playerNickname: "Alice",
      playerRole: "player",
      playerStatus: "active",
    };
    const { getByTestId, getAllByTestId } = render(<PlayerTableRow
      isCurUserAdminPlayer={false}
      isCurUser={false}
      playerExposedInfo={otherPlayerExposedInfo}
      withAdminButtons={false}
    />);

    const tableRow = getByTestId("table-row-tid");
    expect(tableRow).toBeTruthy()

    const tableCells = getAllByTestId("RnuiTableCell-tid");
    expect(tableCells).toHaveLength(3);
  });

  it("renders an extra empty cell when withAdminButtons = true, cur user is admin, and the row is for the cur user as a player", () => {
    const otherPlayerExposedInfo: PlayerExposedInfoT = {
      playerUserId: "p1",
      playerNickname: "Alice",
      playerRole: "player",
      playerStatus: "active",
    };
    const { getByTestId } = render(<PlayerTableRow
      isCurUserAdminPlayer={true}
      isCurUser={true}
      playerExposedInfo={otherPlayerExposedInfo}
      withAdminButtons
    />);

    getByTestId("RnuiTableCell-noButtons-tid");
  });

  it("renders an extra cell for button when withAdminButtons = true, cur user is admin, but the player is another player", () => {
    const otherPlayerExposedInfo: PlayerExposedInfoT = {
      playerUserId: "p1",
      playerNickname: "Alice",
      playerRole: "player",
      playerStatus: "active",
    };
    const { getByTestId } = render(<PlayerTableRow
      isCurUserAdminPlayer={true}
      isCurUser={false}
      playerExposedInfo={otherPlayerExposedInfo}
      withAdminButtons
    />);

    getByTestId("RnuiTableCell-buttons-tid");
  });

  it("renders gray text color when player is invited", () => {
    const otherPlayerExposedInfo: PlayerExposedInfoT = {
      playerUserId: "p1",
      playerNickname: "Alice",
      playerRole: "player",
      playerStatus: "invited",
    };
    const { getByTestId } = render(<PlayerTableRow
      isCurUserAdminPlayer={true}
      isCurUser={false}
      playerExposedInfo={otherPlayerExposedInfo}
    />);

    const statusText = getByTestId("status-text-tid");
    expect(statusText.props.theme.colors.onSurface).toBe('gray');
  });

  it("renders no text color when player is active", () => {
    const otherPlayerExposedInfo: PlayerExposedInfoT = {
      playerUserId: "p1",
      playerNickname: "Alice",
      playerRole: "player",
      playerStatus: "active",
    };
    const { getByTestId } = render(<PlayerTableRow
      isCurUserAdminPlayer={true}
      isCurUser={false}
      playerExposedInfo={otherPlayerExposedInfo}
    />);

    const statusText = getByTestId("status-text-tid");
    expect(statusText.props.theme.colors.onSurface).toBe(undefined);
  });

  it("renders red text color when player is suspended", () => {
    const otherPlayerExposedInfo: PlayerExposedInfoT = {
      playerUserId: "p1",
      playerNickname: "Alice",
      playerRole: "player",
      playerStatus: "suspended",
    };
    const { getByTestId } = render(<PlayerTableRow
      isCurUserAdminPlayer={true}
      isCurUser={false}
      playerExposedInfo={otherPlayerExposedInfo}
    />);

    const statusText = getByTestId("status-text-tid");
    expect(statusText.props.theme.colors.onSurface).toBe("red");
  });

  it("renders suspend button and handles press", async () => {
    const otherPlayerExposedInfo: PlayerExposedInfoT = {
      playerUserId: "p1",
      playerNickname: "Alice",
      playerRole: "player",
      playerStatus: "active",
    };
    const { getByTestId, getByText } = render(<PlayerTableRow
      isCurUserAdminPlayer={true}
      isCurUser={false}
      playerExposedInfo={otherPlayerExposedInfo}
      withAdminButtons
    />);

    getByText(buildMockedTranslation("games:suspend"));

    const suspendButton = getByTestId("suspend-btn-tid");
    expect(suspendButton).toBeTruthy();

    await act(async () => {
      fireEvent.press(suspendButton);
    });
  });

  it("renders activate button and handles press", async () => {
    const otherPlayerExposedInfo: PlayerExposedInfoT = {
      playerUserId: "p1",
      playerNickname: "Alice",
      playerRole: "player",
      playerStatus: "suspended",
    };
    const { getByTestId, getByText } = render(<PlayerTableRow
      isCurUserAdminPlayer={true}
      isCurUser={false}
      playerExposedInfo={otherPlayerExposedInfo}
      withAdminButtons
    />);

    getByText(buildMockedTranslation("games:activate"));

    const activateButton = getByTestId("activate-btn-tid");
    expect(activateButton).toBeTruthy();

    await act(async () => {
      fireEvent.press(activateButton);
    });
  });

  it("renders uninvite button and handles press", async () => {
    const otherPlayerExposedInfo: PlayerExposedInfoT = {
      playerUserId: "p1",
      playerNickname: "Alice",
      playerRole: "player",
      playerStatus: "invited",
    };
    const { getByTestId, getByText } = render(<PlayerTableRow
      isCurUserAdminPlayer={true}
      isCurUser={false}
      playerExposedInfo={otherPlayerExposedInfo}
      withAdminButtons
    />);

    getByText(buildMockedTranslation("games:uninvite"));

    const uninviteButton = getByTestId("uninvite-btn-tid");
    expect(uninviteButton).toBeTruthy();

    await act(async () => {
      fireEvent.press(uninviteButton);
    });
  });
});