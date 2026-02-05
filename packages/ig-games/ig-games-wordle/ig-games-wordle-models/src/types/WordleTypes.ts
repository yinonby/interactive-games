
import { type LangCodeT } from '@ig/utils';

export type WordleExposedConfigT = {
  langCode: LangCodeT
  wordLength: number,
  allowedGuessesNum: number,
}

export type WordleStateT = {
  guessDatas: WordleGuessDataT[],
  correctSolution?: string,
}

export type WordleGuessDataT = {
  guess: string,
  letterAnalyses: LetterAnalysisT[],
}

export type LetterAnalysisT = 'hit' | 'present' | 'notPresent';
