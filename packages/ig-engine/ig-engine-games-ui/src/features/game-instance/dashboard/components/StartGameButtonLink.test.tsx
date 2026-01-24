
import { __engineAppUiMocks } from '@ig/engine-app-ui';
import { fireEvent, render } from '@testing-library/react-native';
import React, { act } from 'react';
import { buildMockedTranslation } from '../../../../../test/mocks/EngineAppUiMocks';
import * as GameInstanceController from '../../../../domains/game-instance/controller/user-actions/GameInstanceController';
import { StartGameButtonLink } from './StartGameButtonLink';

// tests

describe('StartGameButtonLink', () => {
  const {
    onUnknownErrorMock,
  } = __engineAppUiMocks;
  const useGameInstanceControllerSpy = jest.spyOn(GameInstanceController, 'useGameInstanceController');
  const onStartGameMock = jest.fn();
  useGameInstanceControllerSpy.mockReturnValue({
    onStartGame: onStartGameMock,
    onSendChatMessage: jest.fn(),
  });
  const gameInstanceId = 'ABC';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders properly', async () => {
    // render
    const { getByTestId, getByText } = render(
      <StartGameButtonLink gameInstanceId={gameInstanceId} />
    );

    // verify components
    getByTestId('RnuiButton-tid');
    getByText(buildMockedTranslation('games:startGame'));
  });

  it('calls onStartGame when button is pressed', async () => {
    // setup mocks
    onStartGameMock.mockImplementation(() => {});

    // render
    const { getByTestId } = render(
      <StartGameButtonLink gameInstanceId={gameInstanceId} />
    );

    // simulate press
    const btn = getByTestId('RnuiButton-tid');
    await act(async () => {
      fireEvent.press(btn);
    });

    // verify calls
    expect(onStartGameMock).toHaveBeenCalledWith(gameInstanceId);
    expect(onUnknownErrorMock).not.toHaveBeenCalled();
  });

  it('calls onStartGame when button is pressed and handles error', async () => {
    // setup mocks
    onStartGameMock.mockRejectedValue('ERR');

    // render
    const { getByTestId } = render(
      <StartGameButtonLink gameInstanceId={gameInstanceId} />
    );

    // simulate press
    const btn = getByTestId('RnuiButton-tid');
    await act(async () => {
      fireEvent.press(btn);
    });

    // verify calls
    expect(onStartGameMock).toHaveBeenCalledWith(gameInstanceId);
    expect(onUnknownErrorMock).toHaveBeenCalledWith('ERR');
  });
});
