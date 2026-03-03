import type { CodeLevelStateT } from '@ig/games-engine-models';
import { buildCodeLevelStateMock } from '@ig/games-engine-models/test-utils';
import { analyzeCodePuzzleGuess } from './CodePuzzleLogic';


describe('analyzeCodePuzzleGuess', () => {
  const baseState: CodeLevelStateT = buildCodeLevelStateMock({
    kind: 'code',
    codeSolution: 'AbC123',
    isCaseSensitive: true,
  });

  it('should return true when case-sensitive and exact match', () => {
    const result = analyzeCodePuzzleGuess(baseState, 'AbC123');

    expect(result.isCorrectGuess).toBe(true);
  });

  it('should return false when case-sensitive and different case', () => {
    const result = analyzeCodePuzzleGuess(baseState, 'abc123');

    expect(result.isCorrectGuess).toBe(false);
  });

  it('should return true when case-insensitive and match ignoring case', () => {
    const state = {
      ...baseState,
      isCaseSensitive: false,
    };

    const result = analyzeCodePuzzleGuess(state, 'abc123');

    expect(result.isCorrectGuess).toBe(true);
  });

  it('should return false when case-insensitive but different content', () => {
    const state = {
      ...baseState,
      isCaseSensitive: false,
    };

    const result = analyzeCodePuzzleGuess(state, 'xyz123');

    expect(result.isCorrectGuess).toBe(false);
  });

  it('should not mutate the input state', () => {
    const original = structuredClone(baseState);

    analyzeCodePuzzleGuess(baseState, 'AbC123');

    expect(baseState).toEqual(original);
  });
});