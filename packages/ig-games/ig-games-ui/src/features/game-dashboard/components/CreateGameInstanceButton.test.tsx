
import { __engineAppUiMocks } from '@ig/engine-app-ui';
import { __puiMocks } from '@ig/platform-ui';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';
import type { GamesUserConfigControllerT } from '../../../domains/user-config/controller/user-actions/GamesUserConfigController';
import * as GamesUserConfigController from '../../../domains/user-config/controller/user-actions/GamesUserConfigController';
import { CreateGameInstanceButton } from './CreateGameInstanceButton';

// tests

describe('CreateGameInstanceButton', () => {
  const {
    onUnknownErrorMock,
    buildGameInstanceDashboardUrlPathMock,
  } = __engineAppUiMocks;
  const { navigateMock } = __puiMocks;
  const useUserConfigControllerSpy = jest.spyOn(GamesUserConfigController, 'useGamesUserConfigController');
  const onCreateGameInstanceMock = jest.fn();
  const gameConfigId = 'ABC';

  useUserConfigControllerSpy.mockReturnValue({
    onCreateGameInstance: onCreateGameInstanceMock,
  } as unknown as GamesUserConfigControllerT);

  it('renders properly', async () => {
    const { getByTestId } = render(
      <CreateGameInstanceButton gameConfigId={gameConfigId} />
    );

    getByTestId('RnuiButton-tid');
  });

  it('handles button click, onCreateGameInstance succeeds', async () => {
    // setup mocks
    onCreateGameInstanceMock.mockResolvedValueOnce("giid-123");
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
      expect(onCreateGameInstanceMock).toHaveBeenCalledWith(gameConfigId);
    });
    expect(buildGameInstanceDashboardUrlPathMock).toHaveBeenCalledWith("giid-123");
    expect(navigateMock).toHaveBeenCalledWith('mockedUrl');
  });

  it('handles button click, onCreateGameInstance throws error', async () => {
    onCreateGameInstanceMock.mockRejectedValue('ERR');

    const { getByTestId } = render(
      <CreateGameInstanceButton gameConfigId={gameConfigId} />
    );

    const btn = getByTestId('RnuiButton-tid');
    fireEvent(btn, 'onPress');

    await waitFor(() => {
      expect(onCreateGameInstanceMock).toHaveBeenCalledWith(gameConfigId);
    });

    expect(onUnknownErrorMock).toHaveBeenCalledWith('ERR');
  });
});
