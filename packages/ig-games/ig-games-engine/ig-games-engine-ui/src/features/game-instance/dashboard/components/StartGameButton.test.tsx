
import { __engineAppUiMocks } from '@ig/app-engine-ui';
import { buildMockedTranslation } from '@ig/app-engine-ui/test-utils';
import { fireEvent, render } from '@testing-library/react-native';
import React, { act } from 'react';
import type { GameInstanceControllerT } from '../../../../domains/game-instance/controller/user-actions/GameInstanceController';
import * as GameInstanceController from '../../../../domains/game-instance/controller/user-actions/GameInstanceController';
import { StartGameButton } from './StartGameButton';

// tests

describe('StartGameButton', () => {
  const {
    onUnknownErrorMock,
  } = __engineAppUiMocks;
  const useGameInstanceControllerSpy = jest.spyOn(GameInstanceController, 'useGameInstanceController');
  const onStartPlayingMock = jest.fn();
  useGameInstanceControllerSpy.mockReturnValue({
    onStartPlaying: onStartPlayingMock,
    onSendChatMessage: jest.fn(),
  } as unknown as GameInstanceControllerT);
  const gameInstanceId = 'ABC';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders properly', async () => {
    // render
    const { getByTestId, getByText } = render(
      <StartGameButton gameInstanceId={gameInstanceId} />
    );

    // verify components
    getByTestId('RnuiButton-tid');
    getByText(buildMockedTranslation('games:startGame'));
  });

  it('calls onStartPlaying when button is pressed', async () => {
    // setup mocks
    onStartPlayingMock.mockImplementation(() => {});

    // render
    const { getByTestId } = render(
      <StartGameButton gameInstanceId={gameInstanceId} />
    );

    // simulate press
    const btn = getByTestId('RnuiButton-tid');
    await act(async () => {
      fireEvent.press(btn);
    });

    // verify calls
    expect(onStartPlayingMock).toHaveBeenCalledWith(gameInstanceId);
    expect(onUnknownErrorMock).not.toHaveBeenCalled();
  });

  it('calls onStartPlaying when button is pressed and handles error', async () => {
    // setup mocks
    onStartPlayingMock.mockRejectedValue('ERR');

    // render
    const { getByTestId } = render(
      <StartGameButton gameInstanceId={gameInstanceId} />
    );

    // simulate press
    const btn = getByTestId('RnuiButton-tid');
    await act(async () => {
      fireEvent.press(btn);
    });

    // verify calls
    expect(onStartPlayingMock).toHaveBeenCalledWith(gameInstanceId);
    expect(onUnknownErrorMock).toHaveBeenCalledWith('ERR');
  });
});
