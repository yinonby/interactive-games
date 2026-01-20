
import type { GameInstanceExposedInfoT } from "@ig/engine-models";
import { render } from '@testing-library/react-native';
import React from 'react';
import { GameInstanceView } from './GameInstanceView';

// mocks

jest.mock('./GameInstanceSummaryView', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');

  return {
    GameInstanceSummaryView: View,
  };
});

jest.mock('./InviteView', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');

  return {
    InviteView: View,
  };
});

jest.mock('./PlayersView', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');

  return {
    PlayersView: View,
  };
});

jest.mock('./ChatView', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');

  return {
    ChatView: View,
  };
});

describe('GameInstanceView', () => {
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

  it('renders the game name', () => {
    const { queryByTestId } = render(
      <GameInstanceView gameInstanceExposedInfo={gameInstanceExposedInfo} gameInstanceChatMessages={[]} />
    );

    expect(queryByTestId('game-instance-summary-view-tid')).toBeTruthy();
    expect(queryByTestId('invite-view-tid')).toBeTruthy();
    expect(queryByTestId('players-view-tid')).toBeTruthy();
    expect(queryByTestId('chat-view-tid')).toBeTruthy();
  });
});
