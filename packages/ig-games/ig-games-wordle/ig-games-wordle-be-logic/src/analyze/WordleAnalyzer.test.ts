
import type { PublicWordleConfigT, PublicWordleStateT } from '@ig/games-wordle-models';
import { analyzeWordleGuess } from './WordleAnalyzer';

describe('analyzeWordleGuess', () => {
  const wordleSolution = 'apple';
  const publicWordleConfig: PublicWordleConfigT = {
    langCode: 'en',
    wordLength: 5,
    difficulty: 'easy',
    allowedGuessesNum: 3,
  };
  const publicWordleState: PublicWordleStateT = {
    guessDatas: [],
    correctGuess: undefined,
  };

  it('should mark correct guess', () => {
    const result = analyzeWordleGuess({
      wordleSolution,
      publicWordleConfig,
      publicWordleState,
      guess: 'apple',
    });

    expect(result.isCorrectGuess).toBe(true);
    expect(result.isWordleFailed).toBe(false);

    expect(result.newPublicWordleState.guessDatas)
      .toHaveLength(1);

    expect(
      result.newPublicWordleState.guessDatas[0]
    ).toEqual({
      guess: 'apple',
      letterAnalyses: ['hit', 'hit', 'hit', 'hit', 'hit'],
    });
  });

  it('should mark incorrect guess (not last attempt)', () => {
    const result = analyzeWordleGuess({
      wordleSolution,
      publicWordleConfig,
      publicWordleState,
      guess: 'apart',
    });

    expect(result.isCorrectGuess).toBe(false);
    expect(result.isWordleFailed).toBe(false);

    expect(
      result.newPublicWordleState.guessDatas
    ).toHaveLength(1);
  });

  it('should mark wordle failed on last guess', () => {
    const result = analyzeWordleGuess({
      wordleSolution,
      publicWordleConfig,
      publicWordleState: {
        guessDatas: [
          { guess: 'aaaaa', letterAnalyses: [] },
          { guess: 'bbbbb', letterAnalyses: [] },
        ],
        correctGuess: undefined,
      },
      guess: 'wrong',
    });

    expect(result.isCorrectGuess).toBe(false);
    expect(result.isWordleFailed).toBe(true);

    expect(
      result.newPublicWordleState.correctGuess
    ).toBe('apple');

    expect(
      result.newPublicWordleState.guessDatas
    ).toHaveLength(3);
  });
});