
import { type LangCodeT } from '@ig/utils';

export type PublicWordleConfigT = {
  langCode: LangCodeT
  wordLength: number,
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
