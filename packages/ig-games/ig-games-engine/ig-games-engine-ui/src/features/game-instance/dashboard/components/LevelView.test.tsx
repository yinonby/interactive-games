
import type { LevelStateT } from '@ig/games-engine-models';
import { buildTestLevelState } from '@ig/games-engine-models/test-utils';
import { render } from '@testing-library/react-native';
import React from 'react';
import { LevelView } from './LevelView';

// Mock WordleView to verify prop drilling
jest.mock('@ig/games-wordle-ui', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');

  return {
    WordleView: View,
  }
});

// test

describe('LevelView', () => {
  const onSubmitGuessMock = jest.fn();

  it('renders WordleView when levelState.kind is "wordle"', () => {
    const wordleLevelState: LevelStateT = buildTestLevelState({
      kind: 'wordle',
      levelStatus: 'levelInProcess',
      wordleExposedConfig: { langCode: 'en', wordLength: 5, allowedGuessesNum: 6 },
      wordleState: {
        guessDatas: [],
        correctSolution: 'HELLO'
      },
    });

    const { getByTestId } = render(
      <LevelView
        levelState={wordleLevelState}
        onSubmitGuess={onSubmitGuessMock}
      />
    );

    // verify components
    getByTestId('WordleView-tid');
  });

  it('returns null (renders nothing) when levelState.kind is unknown', () => {
    const unknownLevelState: LevelStateT = buildTestLevelState({
      kind: 'unknown_game_type' as 'wordle',
    });

    const { queryByTestId } = render(
      <LevelView
        levelState={unknownLevelState}
        onSubmitGuess={onSubmitGuessMock}
      />
    );

    // verify components
    expect(queryByTestId('WordleView-tid')).toBeNull();
  });
});
