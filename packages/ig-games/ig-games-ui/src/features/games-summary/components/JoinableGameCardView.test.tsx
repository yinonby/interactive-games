
import { __engineAppUiMocks } from '@ig/engine-app-ui';
import { buildTestMinimalGameConfig } from '@ig/games-models/test-utils';
import { __puiMocks } from '@ig/platform-ui';
import { act, fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { buildMockedTranslation } from '../../../../test/mocks/EngineAppUiMocks';
import type { GamesUserConfigControllerT } from '../../../domains/user-config/controller/user-actions/GamesUserConfigController';
import * as GamesUserConfigController from '../../../domains/user-config/controller/user-actions/GamesUserConfigController';
import * as GameViewUtils from '../../../utils/GameViewUtils';
import { JoinableGameCardView } from './JoinableGameCardView';

// mocks

jest.mock('../../../features/common/game-config/GameImageCard', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');

  return {
    GameImageCard: View,
  };
});

jest.mock('./MinimalGameConfigTableRows', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');

  return {
    MinimalGameConfigTableRows: View,
  };
});

describe('JoinableGameCardView', () => {
  const {
    buildGameDashboardUrlPathMock,
    onUnknownErrorMock,
  } = __engineAppUiMocks;
  const { navigateMock } = __puiMocks;
  const onPlayGameMock = jest.fn();
  const useUserConfigControllerSpy = jest.spyOn(GamesUserConfigController, 'useGamesUserConfigController');
  const getMinimalGameConfigImagePropsSpy = jest.spyOn(GameViewUtils, 'getMinimalGameConfigImageProps');

  beforeEach(() => {
    jest.clearAllMocks();

    getMinimalGameConfigImagePropsSpy.mockReturnValue(undefined);
  });

  it('renders correctly', async () => {
    useUserConfigControllerSpy.mockReturnValue({
      onPlayGame: onPlayGameMock,
      onAcceptInvite: jest.fn(),
      onCreateGameInstance: jest.fn(),
    } as GamesUserConfigControllerT);

    onPlayGameMock.mockResolvedValue('game-instance-123');

    const minimalGameConfig = buildTestMinimalGameConfig({
      gameConfigId: 'gcid-1',
      gameName: 'Test Game',
    });

    const { getByText, getByTestId } = render(
      <JoinableGameCardView
        minimalGameConfig={minimalGameConfig}
      />
    );

    const card = getByTestId('GameImageCard-tid');
    expect(card.props.minimalGameConfig).toEqual(minimalGameConfig);
    expect(card.props.includeFreeLabel).toEqual(true);

    const rows = getByTestId('MinimalGameConfigTableRows-tid');
    expect(rows.props.minimalGameConfig).toEqual(minimalGameConfig);

    getByText(buildMockedTranslation('games:play'));
  });

  it('navigates to the game instance returned by onPlayGame when Play is pressed', async () => {
    useUserConfigControllerSpy.mockReturnValue({
      onPlayGame: onPlayGameMock,
      onAcceptInvite: jest.fn(),
      onCreateGameInstance: jest.fn(),
    } as GamesUserConfigControllerT);

    onPlayGameMock.mockResolvedValue('giid-123');
    buildGameDashboardUrlPathMock.mockReturnValue('mockedUrl');

    const { getByTestId } = render(
      <JoinableGameCardView
        minimalGameConfig={{
          gameConfigId: 'gcid-1',
          kind: 'joint-game',
          gameName: 'Test Game',
          maxDurationMinutes: 30,
          gamePrice: 'free',
          maxParticipants: 4,
          imageAssetName: 'treasure-hunt-1',
        }}
      />
    );

    const btn = getByTestId('play-game-btn-tid');
    await act(async () => {
      fireEvent.press(btn);
    });

    expect(onPlayGameMock).toHaveBeenCalledWith('gcid-1');
    expect(buildGameDashboardUrlPathMock).toHaveBeenCalledWith('gcid-1');
    expect(navigateMock).toHaveBeenCalledWith('mockedUrl');
  });

  it('handles error thrown by onPlayGame', async () => {
    useUserConfigControllerSpy.mockReturnValue({
      onPlayGame: onPlayGameMock,
      onAcceptInvite: jest.fn(),
      onCreateGameInstance: jest.fn(),
    } as GamesUserConfigControllerT);

    const error = "ERR";
    onPlayGameMock.mockRejectedValue(error);

    const { getByTestId } = render(
      <JoinableGameCardView
        minimalGameConfig={{
          gameConfigId: 'gcid-1',
          kind: 'joint-game',
          gameName: 'Test Game',
          maxDurationMinutes: 30,
          gamePrice: 'free',
          maxParticipants: 4,
          imageAssetName: 'treasure-hunt-1',
        }}
      />
    );

    const btn = getByTestId('play-game-btn-tid');
    await act(async () => {
      fireEvent.press(btn);
    });

    expect(onPlayGameMock).toHaveBeenCalledWith('gcid-1');
    expect(onUnknownErrorMock).toHaveBeenCalledWith(error);
  });
});
