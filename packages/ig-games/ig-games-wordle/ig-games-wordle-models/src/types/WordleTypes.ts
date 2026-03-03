
import { type LangCodeT } from '@ig/utils';

export type WordleSolutionConfigT = {
  easy: string[],
  medium: string[],
  hard: string[],
}

export type PublicWordleConfigT = {
  langCode: LangCodeT
  wordLength: number,
  difficulty: 'easy' | 'medium' | 'hard',
  allowedGuessesNum: number,
}

export type PublicWordleStateT = {
  guessDatas: WordleGuessDataT[],
  correctGuess?: string,
}

export type WordleGuessDataT = {
  guess: string,
  letterAnalyses: LetterAnalysisT[],
}

export type LetterAnalysisT = 'hit' | 'present' | 'notPresent';
