
import type { LetterAnalysisT, PublicWordleConfigT, PublicWordleStateT } from '@ig/games-wordle-models';

export function analyzeWordleGuess(args: {
  publicWordleConfig: PublicWordleConfigT,
  publicWordleState: PublicWordleStateT,
  wordleSolution: string,
  guess: string,
}): {
  newPublicWordleState: PublicWordleStateT,
  isCorrectGuess: boolean,
  isWordleFailed: boolean,
} {
  const { publicWordleConfig, publicWordleState, wordleSolution, guess } = args;
  const lowercaseSolution = wordleSolution.toLocaleLowerCase();
  const lowercaseGuess = guess.toLocaleLowerCase();
  const isCorrectGuess = lowercaseSolution === lowercaseGuess;
  const isLastGuess = publicWordleState.guessDatas.length >= publicWordleConfig.allowedGuessesNum - 1;

  const letterAnalyses: LetterAnalysisT[] = [];
  for (let i = 0; i < lowercaseGuess.length; i++) {
    const guessLetter = lowercaseGuess[i].toLowerCase();
    const correctLetter = lowercaseSolution[i];
    if (guessLetter === correctLetter) {
      letterAnalyses.push('hit');
    } else if (lowercaseSolution.includes(guessLetter)) {
      letterAnalyses.push('present');
    } else {
      letterAnalyses.push('notPresent');
    }
  }

  const newPublicWordleState: PublicWordleStateT = {
    ...publicWordleState,
    guessDatas: [...publicWordleState.guessDatas, {
      guess: guess,
      letterAnalyses: letterAnalyses,
    }],
    correctGuess: isLastGuess ? wordleSolution : undefined,
  }

  return {
    newPublicWordleState: newPublicWordleState,
    isCorrectGuess: isCorrectGuess,
    isWordleFailed: isLastGuess,
  }
}
