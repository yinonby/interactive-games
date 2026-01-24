
import {
  type GameInstanceExposedInfoT
} from '@ig/engine-models';
import { buildTestGameConfig, buildTestGameInstanceExposedInfo, buildTestGameState } from '@ig/engine-models/test-utils';
import { render } from '@testing-library/react-native';
import React from 'react';
import { buildMockedTranslation } from '../../../../../test/mocks/EngineAppUiMocks';
import { GameInstanceConfigSummaryView } from './GameInstanceConfigSummaryView';

jest.mock('../../common/GameStatusView', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');

  return {
    GameStatusView: View,
  };
});

jest.mock('./StartGameButton', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');

  return {
    StartGameButton: View,
  };
});

describe('GameInstanceConfigSummaryView', () => {
  it('renders component properly', () => {
    const gameInstanceExposedInfo: GameInstanceExposedInfoT = buildTestGameInstanceExposedInfo({
      gameConfig: buildTestGameConfig({
        gameName: 'Treasure Hunt 1',
        maxDurationMinutes: 60,
        maxParticipants: 6,
      }),
      gameState: buildTestGameState({
        gameStatus: 'in-process',
      }),
    });

    const { getByTestId, getByText } = render(<GameInstanceConfigSummaryView
      gameInstanceExposedInfo={gameInstanceExposedInfo}
    />);

    getByTestId('title-tid');
    getByTestId('game-status-tid');
    getByTestId('duration-text-tid');
    getByTestId('max-participants-tid');

    getByText('Treasure Hunt 1');
    getByText(buildMockedTranslation('common:duration') + ': ' + buildMockedTranslation('common:minutes'));
    getByText(buildMockedTranslation('games:maxParticipants') + ': 6');
  });

  it('renders start button when game status is not-started', () => {
    const gameInstanceExposedInfo: GameInstanceExposedInfoT = buildTestGameInstanceExposedInfo({
      gameInstanceId: 'giid-1',
      gameConfig: buildTestGameConfig({
        gameName: 'Treasure Hunt 1',
        maxDurationMinutes: 60,
        maxParticipants: 6,
      }),
      gameState: buildTestGameState({
        gameStatus: 'not-started',
      }),
    });

    const { getByTestId } = render(<GameInstanceConfigSummaryView
      gameInstanceExposedInfo={gameInstanceExposedInfo}
    />);

    getByTestId('StartGameButton-tid');
  });

  it('does not render start button when game status is not not-started', () => {
    const gameInstanceExposedInfo: GameInstanceExposedInfoT = buildTestGameInstanceExposedInfo({
      gameConfig: buildTestGameConfig({
        gameName: 'Treasure Hunt 1',
        maxDurationMinutes: 60,
        maxParticipants: 6,
      }),
      gameState: buildTestGameState({
        gameStatus: 'in-process',
      }),
    });

    const { queryByTestId } = render(<GameInstanceConfigSummaryView
      gameInstanceExposedInfo={gameInstanceExposedInfo}
    />);

    expect(queryByTestId('StartGameButton-tid')).toBeNull();
  });
});