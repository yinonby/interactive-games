
import type { GameInstanceExposedInfoT } from "@ig/engine-models";
import { render } from '@testing-library/react-native';
import React from "react";
import { buildMockedTranslation } from "../../../../test/mocks/EngineAppUiMocks";
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
      gamePrice: "free",
      maxParticipants: 6,
      imageAssetName: "escape-room-1",
      extraTimeMinutes: 10,
      extraTimeLimitMinutes: 20,
      levelConfigs: [],
    },
    playerRole: "admin",
    playerStatus: "playing",
    gameStatus: "in-process",
    otherPlayerExposedInfos: [],
  }

  it("renders component properly", () => {
    const { getByTestId, getByText } = render(<GameInstanceSummaryView
      gameInstanceExposedInfo={gameInstanceExposedInfo}
    />);

    getByTestId("title-tid");
    getByTestId("game-status-tid");
    getByTestId("duration-text-tid");
    getByTestId("max-participants-tid");

    getByText("Treasure Hunt 1");
    getByText(buildMockedTranslation("common:duration") + ": " + buildMockedTranslation("common:minutes"));
    getByText(buildMockedTranslation("games:maxParticipants") + ": 6");
  });
});