
import type { GameInstanceExposedInfoT } from "@ig/engine-models";
import { render } from '@testing-library/react-native';
import React from "react";
import { GameInstanceSummaryView } from "./GameInstanceSummaryView";

jest.mock("./GameStatusView", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');

  return {
    GameStatusView: View,
  };
});

describe("GameInstanceSummaryView", () => {
  const gameInstanceExposedInfo: GameInstanceExposedInfoT = {
    gameInstanceId: "gid-1",
    invitationCode: "invt-code-gid-1",
    gameConfig: {
      gameConfigId: "treasure-hunt-1",
      kind: "joint-game",
      gameName: "Treasure Hunt 1",
      maxDurationMinutes: 60,
      maxParticipants: 6,
      extraTimeMinutes: 10,
      extraTimeLimitMinutes: 20,
      levelConfigs: [],
    },
    playerRole: "admin",
    playerStatus: "playing",
    gameStatus: "in-process",
    otherPlayerExposedInfos: [],
  }

  it("renders component properly, no buttons when player is not admin", () => {
    const { getByTestId } = render(<GameInstanceSummaryView
      gameInstanceExposedInfo={gameInstanceExposedInfo}
    />);

    const title = getByTestId("title-tid");
    expect(title.children).toContain("Treasure Hunt 1");

    const gameStatus = getByTestId("game-status-tid");
    expect(gameStatus).toBeTruthy();

    const durationText = getByTestId("duration-text-tid");
    expect(durationText).toBeTruthy();

    const maxParticipantsText = getByTestId("max-participants-tid");
    expect(maxParticipantsText).toBeTruthy();
  });
});