
import { __engineAppUiMocks } from '@ig/app-engine-ui';
import { buildMockedTranslation } from '@ig/app-engine-ui/test-utils';
import { buildMinimalPublicGameConfigMock } from '@ig/games-engine-models/test-utils';
import { __puiMocks } from '@ig/platform-ui';
import { MIN_TO_MS } from '@ig/utils';
import { act, fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import type { GameUserControllerT } from '../../../domains/game-user/controller/user-actions/GameUserController';
import * as GameUserControllerModule from '../../../domains/game-user/controller/user-actions/GameUserController';
import * as GameViewUtils from '../../../utils/GameViewUtils';
import { JoinableGameCardView } from './JoinableGameCardView';

// mocks

jest.mock('../../../features/common/game-info/GameImageCard', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');

  return {
    GameImageCard: View,
  };
});

jest.mock('./MinimalPublicGameConfigTableRows', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');

  return {
    MinimalPublicGameConfigTableRows: View,
  };
});

describe('JoinableGameCardView', () => {
  const {
    buildGameDashboardUrlPathMock,
    onUnknownErrorMock,
  } = __engineAppUiMocks;
  const { navigateMock } = __puiMocks;
  const mock_onAddGameConfigId = jest.fn();
  const spy_useGameUserController = jest.spyOn(GameUserControllerModule, 'useGameUserController');
  const spy_getGameConfigImageProps = jest.spyOn(GameViewUtils, 'getGameConfigImageProps');

  beforeEach(() => {
    jest.clearAllMocks();

    spy_getGameConfigImageProps.mockReturnValue(undefined);
  });

  it('renders correctly', async () => {
    spy_useGameUserController.mockReturnValue({
      onAddGameConfigId: mock_onAddGameConfigId,
    } as unknown as GameUserControllerT);

    mock_onAddGameConfigId.mockResolvedValue('game-instance-123');

    const minimalPublicGameConfig = buildMinimalPublicGameConfigMock({
      gameConfigId: 'gcid-1',
      gameName: 'Test Game',
    });

    const { getByText, getByTestId } = render(
      <JoinableGameCardView
        minimalPublicGameConfig={minimalPublicGameConfig}
      />
    );

    const card = getByTestId('GameImageCard-tid');
    expect(card.props.minimalPublicGameConfig).toEqual(minimalPublicGameConfig);
    expect(card.props.includeFreeLabel).toEqual(true);

    const rows = getByTestId('MinimalPublicGameConfigTableRows-tid');
    expect(rows.props.minimalPublicGameConfig).toEqual(minimalPublicGameConfig);

    getByText(buildMockedTranslation('games:play'));
  });

  it('navigates to the game instance returned by onAddGameConfigId when Play is pressed', async () => {
    spy_useGameUserController.mockReturnValue({
      onAddGameConfigId: mock_onAddGameConfigId,
    } as unknown as GameUserControllerT);

    mock_onAddGameConfigId.mockResolvedValue('giid-123');
    buildGameDashboardUrlPathMock.mockReturnValue('mockedUrl');

    const { getByTestId } = render(
      <JoinableGameCardView
        minimalPublicGameConfig={{
          gameConfigId: 'gcid-1',
          kind: 'jointGame',
          gameName: 'Test Game',
          maxDurationInfo: { kind: 'limited', durationMs: MIN_TO_MS(30) },
          gamePriceInfo: { kind: 'free' },
          maxParticipants: 4,
          imageInfo: { kind: 'asset', imageAssetName: 'treasure-hunt-1' },
        }}
      />
    );

    const btn = getByTestId('play-game-btn-tid');
    await act(async () => {
      fireEvent.press(btn);
    });

    expect(mock_onAddGameConfigId).toHaveBeenCalledWith('gcid-1');
    expect(buildGameDashboardUrlPathMock).toHaveBeenCalledWith('gcid-1');
    expect(navigateMock).toHaveBeenCalledWith('mockedUrl');
  });

  it('handles error thrown by onAddGameConfigId', async () => {
    spy_useGameUserController.mockReturnValue({
      onAddGameConfigId: mock_onAddGameConfigId,
    } as unknown as GameUserControllerT);

    const error = "ERR";
    mock_onAddGameConfigId.mockRejectedValue(error);

    const { getByTestId } = render(
      <JoinableGameCardView
        minimalPublicGameConfig={{
          gameConfigId: 'gcid-1',
          kind: 'jointGame',
          gameName: 'Test Game',
          maxDurationInfo: { kind: 'limited', durationMs: MIN_TO_MS(30) },
          gamePriceInfo: { kind: 'free' },
          maxParticipants: 4,
          imageInfo: { kind: 'asset', imageAssetName: 'treasure-hunt-1' },
        }}
      />
    );

    const btn = getByTestId('play-game-btn-tid');
    await act(async () => {
      fireEvent.press(btn);
    });

    expect(mock_onAddGameConfigId).toHaveBeenCalledWith('gcid-1');
    expect(onUnknownErrorMock).toHaveBeenCalledWith(error);
  });
});
