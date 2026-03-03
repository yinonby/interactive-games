
import { __engineAppUiMocks } from '@ig/app-engine-ui';
import { __puiMocks } from '@ig/platform-ui';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';
import type {
  GameInstanceControllerT
} from '../../../domains/game-instance/controller/user-actions/GameInstanceController';
import * as GamesUserConfigControllerModule from '../../../domains/game-instance/controller/user-actions/GameInstanceController';
import { CreateGameInstanceButton } from './CreateGameInstanceButton';

// tests

describe('CreateGameInstanceButton', () => {
  const {
    onUnknownErrorMock,
    buildGameInstanceDashboardUrlPathMock,
  } = __engineAppUiMocks;
  const { navigateMock } = __puiMocks;
  const spy_useGameInstanceController = jest.spyOn(GamesUserConfigControllerModule, 'useGameInstanceController');
  const mock_onCreateGameInstance = jest.fn();
  const gameConfigId = 'ABC';

  spy_useGameInstanceController.mockReturnValue({
    onCreateGameInstance: mock_onCreateGameInstance,
  } as unknown as GameInstanceControllerT);

  it('renders properly', async () => {
    const { getByTestId } = render(
      <CreateGameInstanceButton gameConfigId={gameConfigId} />
    );

    getByTestId('RnuiButton-tid');
  });

  it('handles button click, onCreateGameInstance succeeds', async () => {
    // setup mocks
    mock_onCreateGameInstance.mockResolvedValueOnce("giid-123");
    buildGameInstanceDashboardUrlPathMock.mockReturnValue('mockedUrl');

    // render
    const { getByTestId } = render(
      <CreateGameInstanceButton gameConfigId={gameConfigId} />
    );

    // click
    const btn = getByTestId('RnuiButton-tid');
    fireEvent(btn, 'onPress');

    // verify calls
    await waitFor(() => {
      expect(mock_onCreateGameInstance).toHaveBeenCalledWith(gameConfigId);
    });
    expect(buildGameInstanceDashboardUrlPathMock).toHaveBeenCalledWith("giid-123");
    expect(navigateMock).toHaveBeenCalledWith('mockedUrl');
  });

  it('handles button click, onCreateGameInstance throws error', async () => {
    mock_onCreateGameInstance.mockRejectedValue('ERR');

    const { getByTestId } = render(
      <CreateGameInstanceButton gameConfigId={gameConfigId} />
    );

    const btn = getByTestId('RnuiButton-tid');
    fireEvent(btn, 'onPress');

    await waitFor(() => {
      expect(mock_onCreateGameInstance).toHaveBeenCalledWith(gameConfigId);
    });

    expect(onUnknownErrorMock).toHaveBeenCalledWith('ERR');
  });
});
