
import { __engineAppUiMocks } from '@ig/engine-app-ui';
import { __puiMocks } from '@ig/platform-ui';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';
import type { GamesUserConfigControllerT } from '../../../domains/user-config/controller/user-actions/GamesUserConfigController';
import * as GamesUserConfigController from '../../../domains/user-config/controller/user-actions/GamesUserConfigController';
import { AddGameInstanceButton } from './AddGameInstanceButton';

// tests

describe('AddGameInstanceButton', () => {
  const {
    onUnknownErrorMock,
    buildGameInstanceDashboardUrlPathMock,
  } = __engineAppUiMocks;
  const { navigateMock } = __puiMocks;
  const useUserConfigControllerSpy = jest.spyOn(GamesUserConfigController, 'useGamesUserConfigController');
  const onAddGameInstanceMock = jest.fn();
  const gameConfigId = 'ABC';

  useUserConfigControllerSpy.mockReturnValue({
    onAddGameInstance: onAddGameInstanceMock,
  } as unknown as GamesUserConfigControllerT);

  it('renders properly', async () => {
    const { getByTestId } = render(
      <AddGameInstanceButton gameConfigId={gameConfigId} />
    );

    getByTestId('RnuiButton-tid');
  });

  it('handles button click, onAddGameInstance succeeds', async () => {
    // setup mocks
    onAddGameInstanceMock.mockResolvedValueOnce("giid-123");
    buildGameInstanceDashboardUrlPathMock.mockReturnValue('mockedUrl');

    // render
    const { getByTestId } = render(
      <AddGameInstanceButton gameConfigId={gameConfigId} />
    );

    // click
    const btn = getByTestId('RnuiButton-tid');
    fireEvent(btn, 'onPress');

    // verify calls
    await waitFor(() => {
      expect(onAddGameInstanceMock).toHaveBeenCalledWith(gameConfigId);
    });
    expect(buildGameInstanceDashboardUrlPathMock).toHaveBeenCalledWith("giid-123");
    expect(navigateMock).toHaveBeenCalledWith('mockedUrl');
  });

  it('handles button click, onAddGameInstance throws error', async () => {
    onAddGameInstanceMock.mockRejectedValue('ERR');

    const { getByTestId } = render(
      <AddGameInstanceButton gameConfigId={gameConfigId} />
    );

    const btn = getByTestId('RnuiButton-tid');
    fireEvent(btn, 'onPress');

    await waitFor(() => {
      expect(onAddGameInstanceMock).toHaveBeenCalledWith(gameConfigId);
    });

    expect(onUnknownErrorMock).toHaveBeenCalledWith('ERR');
  });
});
