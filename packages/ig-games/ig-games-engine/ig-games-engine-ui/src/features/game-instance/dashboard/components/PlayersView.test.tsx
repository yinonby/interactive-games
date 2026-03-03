
import { buildMockedTranslation } from '@ig/app-engine-ui/test-utils';
import type { PublicGameInstanceT, PublicPlayerInfoT } from '@ig/games-engine-models';
import { render } from '@testing-library/react-native';
import React from 'react';
import { PlayersView } from './PlayersView';

jest.mock("./PlayersTableView", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');

  return {
    PlayersTableView: View,
  };
});

describe("PlayersView", () => {
  it("renders correctly, no players", () => {
    const publicPlayerInfos: PublicPlayerInfoT[] = [];
    const publicGameInstance: PublicGameInstanceT = {
      publicPlayerInfos: publicPlayerInfos,
    } as PublicGameInstanceT;

    // render
    const { queryByTestId } = render(<PlayersView publicGameInstance={publicGameInstance} />);

    expect(queryByTestId("container-tid")).toBeNull();
  });

  it("renders correctly", () => {
    const publicPlayerInfos: PublicPlayerInfoT[] = [{
      playerId: "userIdMock",
      playerRole: "admin",
    } as PublicPlayerInfoT];
    const publicGameInstance: PublicGameInstanceT = {
      publicPlayerInfos: publicPlayerInfos,
    } as PublicGameInstanceT;

    // render
    const { getByTestId, getByText } = render(<PlayersView publicGameInstance={publicGameInstance} />);

    getByTestId("container-tid");
    getByTestId("players-text-tid");
    getByText(buildMockedTranslation("games:players"));

    const table = getByTestId("players-table-view-tid");
    expect(table.props.publicPlayerInfos).toBe(publicPlayerInfos);
  });
});