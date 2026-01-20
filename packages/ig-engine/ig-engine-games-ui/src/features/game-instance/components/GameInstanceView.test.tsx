
import { __engineAppUiMocks, type AppConfigContextT } from '@ig/engine-app-ui';
import type { GameInstanceExposedInfoT, PlayerExposedInfoT } from "@ig/engine-models";
import type { RnuiImagePropsT } from '@ig/rnui';
import { render } from '@testing-library/react-native';
import React from 'react';
import * as GameViewUtils from "../../../utils/GameViewUtils";
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
  const { useAppConfigMock, loggerErrorMock } = __engineAppUiMocks;

  // mock curUserId
  const curUserIdMock = "userIdMock";
  useAppConfigMock.mockReturnValue({
    curUserId: curUserIdMock,
  } as AppConfigContextT);

  const getMinimalGameConfigImagePropsSpy = jest.spyOn(GameViewUtils, 'getMinimalGameConfigImageProps');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('does not render when current user is not in players list', () => {
    // mock getMinimalGameConfigImageProps
    getMinimalGameConfigImagePropsSpy.mockReturnValue({} as RnuiImagePropsT);

    // build gameInstanceExposedInfo
    const gameInstanceExposedInfo: GameInstanceExposedInfoT = {
      playerExposedInfos: [] as PlayerExposedInfoT[],
    } as GameInstanceExposedInfoT;

    const { queryByTestId } = render(
      <GameInstanceView gameInstanceExposedInfo={gameInstanceExposedInfo} gameInstanceChatMessages={[]} />
    );

    expect(useAppConfigMock).toHaveBeenCalled();
    expect(getMinimalGameConfigImagePropsSpy).toHaveBeenCalled();
    expect(loggerErrorMock).toHaveBeenCalled();
    expect(queryByTestId('GameInstanceSummaryView-tid')).toBeNull();
    expect(queryByTestId('InviteView-tid')).toBeNull();
    expect(queryByTestId('PlayersView-tid')).toBeNull();
    expect(queryByTestId('ChatView-tid')).toBeNull();
  });

  it('renders correctly, with InviteView for admin', () => {
    // mock getMinimalGameConfigImageProps
    getMinimalGameConfigImagePropsSpy.mockReturnValue({} as RnuiImagePropsT);

    // build gameInstanceExposedInfo
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
      gameStatus: "in-process",
      playerExposedInfos: [{
        playerUserId: curUserIdMock,
        playerRole: "admin",
      } as PlayerExposedInfoT],
    }

    const { getByTestId } = render(
      <GameInstanceView gameInstanceExposedInfo={gameInstanceExposedInfo} gameInstanceChatMessages={[]} />
    );

    expect(useAppConfigMock).toHaveBeenCalled();
    expect(getMinimalGameConfigImagePropsSpy).toHaveBeenCalled();
    expect(loggerErrorMock).not.toHaveBeenCalled();
    getByTestId('GameInstanceSummaryView-tid');
    getByTestId('InviteView-tid');
    getByTestId('PlayersView-tid');
    getByTestId('ChatView-tid');
  });

  it('renders correctly, without InviteView for non-admin', () => {
    // mock getMinimalGameConfigImageProps
    getMinimalGameConfigImagePropsSpy.mockReturnValue({} as RnuiImagePropsT);

    // build gameInstanceExposedInfo
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
      gameStatus: "in-process",
      playerExposedInfos: [{
        playerUserId: curUserIdMock,
        playerRole: "player",
      } as PlayerExposedInfoT],
    }

    const { getByTestId, queryByTestId } = render(
      <GameInstanceView gameInstanceExposedInfo={gameInstanceExposedInfo} gameInstanceChatMessages={[]} />
    );

    expect(useAppConfigMock).toHaveBeenCalled();
    expect(getMinimalGameConfigImagePropsSpy).toHaveBeenCalled();
    expect(loggerErrorMock).not.toHaveBeenCalled();
    getByTestId('GameInstanceSummaryView-tid');
    expect(queryByTestId('InviteView-tid')).toBeNull();
    getByTestId('PlayersView-tid');
    getByTestId('ChatView-tid');
  });
});
