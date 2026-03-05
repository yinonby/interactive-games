
import { __engineAppUiMocks } from '@ig/app-engine-ui';
import { buildMockedTranslation } from '@ig/app-engine-ui/test-utils';
import { __authUiMocks } from '@ig/auth-ui';
import type { PublicPlayerInfoT } from '@ig/games-engine-models';
import { render } from '@testing-library/react-native';
import React from 'react';
import { PlayersTableView } from './PlayersTableView';

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

  // mock curAuthId
  const curAuthId = "userIdMock";
  useAuthMock.mockReturnValue({
    curAuthId: curAuthId,
  });

  it("does not render when current user is not in players list", () => {
    const publicPlayerInfo: PublicPlayerInfoT = {
      playerId: "otherUserId",
      playerRole: 'player',
    } as PublicPlayerInfoT;
    const { queryByTestId } = render(
      <PlayersTableView publicPlayerInfos={[publicPlayerInfo]} />
    );

    // verify calls
    expect(loggerErrorMock).toHaveBeenCalled();

    // verify components
    expect(queryByTestId("table-tid")).toBeNull();
  });

  it("renders component properly withAdminButtons = false", () => {
    const publicPlayerInfo: PublicPlayerInfoT = {
      playerId: curAuthId,
      playerRole: 'admin',
    } as PublicPlayerInfoT;
    const { getByTestId, getAllByTestId, queryAllByTestId, getByText } = render(
      <PlayersTableView publicPlayerInfos={[publicPlayerInfo]} withAdminButtons={false} />
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
    const publicPlayerInfo: PublicPlayerInfoT = {
      playerId: curAuthId,
      playerRole: 'player',
    } as PublicPlayerInfoT;
    const { getByTestId, getAllByTestId, queryAllByTestId, getByText } = render(
      <PlayersTableView publicPlayerInfos={[publicPlayerInfo]} />
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
    const publicPlayerInfo: PublicPlayerInfoT = {
      playerId: curAuthId,
      playerRole: 'admin',
    } as PublicPlayerInfoT;
    const { getByTestId, getAllByTestId, queryAllByTestId, getByText } = render(
      <PlayersTableView publicPlayerInfos={[publicPlayerInfo]} withAdminButtons />
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
    const publicPlayerInfo1: PublicPlayerInfoT = {
      playerId: curAuthId,
      playerRole: 'admin',
    } as PublicPlayerInfoT;
    const publicPlayerInfo2: PublicPlayerInfoT = {
      playerId: 'otherUserId',
      playerRole: 'player',
    } as PublicPlayerInfoT;
    const { queryAllByTestId } = render(
      <PlayersTableView publicPlayerInfos={[publicPlayerInfo1, publicPlayerInfo2]} />
    );

    const playerRows = queryAllByTestId("player-row-tid");
    expect(playerRows).toHaveLength(2);
  });
});
