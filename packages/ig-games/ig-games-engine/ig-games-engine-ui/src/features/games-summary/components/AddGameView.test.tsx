
import { __engineAppUiMocks } from '@ig/app-engine-ui';
import { buildMockedTranslation } from '@ig/app-engine-ui/test-utils';
import { __puiMocks } from '@ig/platform-ui';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';
import type {
  GameInstanceControllerT
} from '../../../domains/game-instance/controller/user-actions/GameInstanceController';
import * as GameInstanceControllerModule from '../../../domains/game-instance/controller/user-actions/GameInstanceController';
import { AddGameView } from './AddGameView';

// tests

describe('AddGameView', () => {
  const {
    onUnknownErrorMock,
    buildGamesDashboardUrlPathMock,
    buildGameInstanceDashboardUrlPathMock,
  } = __engineAppUiMocks;
  const { navigateMock } = __puiMocks;
  const mock_onJoinGameByInvite = jest.fn();
  const spy_useGameInstanceController = jest.spyOn(GameInstanceControllerModule, 'useGameInstanceController');

  spy_useGameInstanceController.mockReturnValue({
    onJoinGameByInvite: mock_onJoinGameByInvite,
  } as unknown as GameInstanceControllerT);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders input and button', () => {
    const { getByTestId, getByText } = render(<AddGameView />);

    getByTestId('add-game-view');
    getByTestId('game-code-input');
    getByTestId('add-game-button');
    getByText(buildMockedTranslation("games:joinGameByInvite"));
  });

  it('renders disabled button when input is empty', () => {
    const { getByTestId } = render(<AddGameView />);

    const button = getByTestId('add-game-button');

    expect(button.props.disabled).toBe(true);
  });

  it('enables button when game code is entered', () => {
    const { getByTestId } = render(<AddGameView />);

    fireEvent(getByTestId('game-code-input'), 'onChangeText', 'ABC123');

    const button = getByTestId('add-game-button');
    expect(button.props.disabled).toBe(false);
  });

  it('does not call onAcceptInvite when button is disabled', () => {
    const { getByTestId } = render(<AddGameView />);

    // simulate press
    fireEvent(getByTestId('add-game-button'), 'onPress');

    expect(mock_onJoinGameByInvite).not.toHaveBeenCalled();
  });

  it('calls onAcceptInvite when button is enabled and pressed', async () => {
    mock_onJoinGameByInvite.mockResolvedValueOnce("giid-123");
    buildGameInstanceDashboardUrlPathMock.mockReturnValue('mockedUrl');

    const { getByTestId } = render(<AddGameView />);

    // simulate press
    fireEvent(getByTestId('game-code-input'), 'onChangeText', 'ABC123');
    fireEvent(getByTestId('add-game-button'), 'onPress');

    await waitFor(() => {
      expect(mock_onJoinGameByInvite).toHaveBeenCalledWith('ABC123');
    });
    expect(buildGameInstanceDashboardUrlPathMock).toHaveBeenCalledWith("giid-123");
    expect(navigateMock).toHaveBeenCalledWith('mockedUrl');
  });

  it('calls onAcceptInvite and handles failure', async () => {
    mock_onJoinGameByInvite.mockRejectedValue({ error: 'ERR' });
    buildGamesDashboardUrlPathMock.mockReturnValue('mockedUrl');

    const { getByTestId } = render(<AddGameView />);

    // simulate press
    fireEvent(getByTestId('game-code-input'), 'onChangeText', 'ABC123');
    fireEvent(getByTestId('add-game-button'), 'onPress');

    await waitFor(() => {
      expect(mock_onJoinGameByInvite).toHaveBeenCalledWith('ABC123');
    });
    expect(onUnknownErrorMock).toHaveBeenCalledWith({ error: 'ERR' });
    expect(buildGamesDashboardUrlPathMock).toHaveBeenCalled();
    expect(navigateMock).toHaveBeenCalledWith('mockedUrl');
  });
});
