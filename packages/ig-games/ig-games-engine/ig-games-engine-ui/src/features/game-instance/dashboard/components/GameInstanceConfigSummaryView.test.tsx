
import { buildMockedTranslation } from '@ig/app-engine-ui/test-utils';
import {
  type PublicGameInstanceT
} from '@ig/games-engine-models';
import {
  buildPublicGameConfigMock, buildTestGameInstanceExposedInfo,
  buildTestGameState
} from '@ig/games-engine-models/test-utils';
import { MIN_TO_MS } from '@ig/utils';
import { render } from '@testing-library/react-native';
import React from 'react';
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
    const publicGameInstance: PublicGameInstanceT = buildTestGameInstanceExposedInfo({
      publicGameConfig: buildPublicGameConfigMock({
        gameName: 'Treasure Hunt 1',
        maxDurationInfo: { kind: 'limited', durationMs: MIN_TO_MS(60) },
        maxParticipants: 6,
      }),
      gameState: buildTestGameState({
        gameStatus: 'inProcess',
      }),
    });

    const { getByTestId, getByText } = render(<GameInstanceConfigSummaryView
      publicGameInstance={publicGameInstance}
    />);

    getByTestId('title-tid');
    getByTestId('game-status-tid');
    getByTestId('duration-text-tid');
    getByTestId('max-participants-tid');

    getByText('Treasure Hunt 1');
    getByText(buildMockedTranslation('common:duration') + ': ' + buildMockedTranslation('common:minutes'));
    getByText(buildMockedTranslation('games:maxParticipants') + ': 6');
  });

  it('renders start button when game status is notStarted', () => {
    const publicGameInstance: PublicGameInstanceT = buildTestGameInstanceExposedInfo({
      gameInstanceId: 'giid-1',
      publicGameConfig: buildPublicGameConfigMock({
        gameName: 'Treasure Hunt 1',
        maxDurationInfo: { kind: 'limited', durationMs: MIN_TO_MS(60) },
        maxParticipants: 6,
      }),
      gameState: buildTestGameState({
        gameStatus: 'notStarted',
      }),
    });

    const { getByTestId } = render(<GameInstanceConfigSummaryView
      publicGameInstance={publicGameInstance}
    />);

    getByTestId('StartGameButton-tid');
  });

  it('does not render start button when game status is not notStarted', () => {
    const publicGameInstance: PublicGameInstanceT = buildTestGameInstanceExposedInfo({
      publicGameConfig: buildPublicGameConfigMock({
        gameName: 'Treasure Hunt 1',
        maxDurationInfo: { kind: 'limited', durationMs: MIN_TO_MS(60) },
        maxParticipants: 6,
      }),
      gameState: buildTestGameState({
        gameStatus: 'inProcess',
      }),
    });

    const { queryByTestId } = render(<GameInstanceConfigSummaryView
      publicGameInstance={publicGameInstance}
    />);

    expect(queryByTestId('StartGameButton-tid')).toBeNull();
  });

  it('renders properly when max duration is unlimited', () => {
    const publicGameInstance: PublicGameInstanceT = buildTestGameInstanceExposedInfo({
      publicGameConfig: buildPublicGameConfigMock({
        gameName: 'Treasure Hunt 1',
        maxDurationInfo: { kind: 'unlimited' },
        maxParticipants: 6,
      }),
      gameState: buildTestGameState({
        gameStatus: 'inProcess',
      }),
    });

    const { getByText } = render(<GameInstanceConfigSummaryView
      publicGameInstance={publicGameInstance}
    />);

    getByText(buildMockedTranslation('common:duration') + ': ' + buildMockedTranslation('common:unlimited'));
  });
});