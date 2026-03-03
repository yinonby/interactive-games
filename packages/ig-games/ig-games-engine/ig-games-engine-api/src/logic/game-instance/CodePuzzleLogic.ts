
import type {
  CodeLevelStateT
} from '@ig/games-engine-models';

export function analyzeCodePuzzleGuess(
  wordleLevelState: CodeLevelStateT,
  guess: string,
): {
  isCorrectGuess: boolean,
} {
  const expectedSolution = wordleLevelState.isCaseSensitive ?
    wordleLevelState.codeSolution : wordleLevelState.codeSolution.toLocaleLowerCase();
  const submittedSolution = wordleLevelState.isCaseSensitive ? guess : guess.toLocaleLowerCase();
  const isCorrectGuess = expectedSolution === submittedSolution;

  return {
    isCorrectGuess: isCorrectGuess,
  }
}
