
import { __engineAppUiMocks } from '@ig/app-engine-ui';
import type { GameInstanceExposedInfoT } from '@ig/games-engine-models';
import { buildTestGameInstanceExposedInfo, buildTestGameState, buildTestLevelState } from '@ig/games-engine-models/test-utils';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';
import type { GameInstanceControllerT } from '../../../../domains/game-instance/controller/user-actions/GameInstanceController';
import * as GameInstanceController from '../../../../domains/game-instance/controller/user-actions/GameInstanceController';
import { LevelsView } from './LevelsView';

// Mock WordleView to verify prop drilling
jest.mock('./LevelView', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');

  return {
    LevelView: View,
  }
});

// test

describe('LevelsView', () => {
  const { onUnknownErrorMock } = __engineAppUiMocks;
  const onSubmitGuessMock = jest.fn();
  const useGameInstanceControllerSpy = jest.spyOn(GameInstanceController, 'useGameInstanceController');
  useGameInstanceControllerSpy.mockReturnValue({
    onSubmitGuess: onSubmitGuessMock
  } as unknown as GameInstanceControllerT);

  it('does not render LevelView when there are no levels', () => {
    const gameInstanceExposedInfo: GameInstanceExposedInfoT = buildTestGameInstanceExposedInfo({
      gameState: buildTestGameState({
        levelStates: [],
      }),
    })

    const { queryByTestId } = render(
      <LevelsView
        gameInstanceExposedInfo={gameInstanceExposedInfo}
      />
    );

    // verify components
    expect(queryByTestId('LevelView-tid')).toBeNull();
  });

  it('renders LevelView and handles onSubmitGuess, no error', async () => {
    // setup mocks
    onSubmitGuessMock.mockResolvedValue(true);

    // render
    const gameInstanceExposedInfo: GameInstanceExposedInfoT = buildTestGameInstanceExposedInfo({
      gameInstanceId: 'GIID1',
      gameState: buildTestGameState({
        levelStates: [buildTestLevelState()],
      }),
    })

    const { getByTestId } = render(
      <LevelsView
        gameInstanceExposedInfo={gameInstanceExposedInfo}
      />
    );

    // verify components
    const levelView = getByTestId('LevelView-tid');

    // Simulate pressing the submit button
    fireEvent(levelView, 'onSubmitGuess', 'ABCDE');

    // Verify the callback was triggered with the correct value
    await waitFor(() => {
      expect(onSubmitGuessMock).toHaveBeenCalledWith('GIID1', 0, "ABCDE");
    });

    expect(onUnknownErrorMock).not.toHaveBeenCalled();
  });

  it('renders LevelView and handles onSubmitGuess, with error', async () => {
    // setup mocks
    onSubmitGuessMock.mockRejectedValue('ERROR');

    // render
    const gameInstanceExposedInfo: GameInstanceExposedInfoT = buildTestGameInstanceExposedInfo({
      gameInstanceId: 'GIID1',
      gameState: buildTestGameState({
        levelStates: [buildTestLevelState()],
      }),
    })

    const { getByTestId } = render(
      <LevelsView
        gameInstanceExposedInfo={gameInstanceExposedInfo}
      />
    );

    // verify components
    const levelView = getByTestId('LevelView-tid');

    // Simulate pressing the submit button
    fireEvent(levelView, 'onSubmitGuess', 'ABCDE');

    // Verify the callback was triggered with the correct value
    await waitFor(() => {
      expect(onSubmitGuessMock).toHaveBeenCalledWith('GIID1', 0, "ABCDE");
    });

    expect(onUnknownErrorMock).toHaveBeenCalledWith('ERROR');
  });
});
