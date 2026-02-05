

import { type WordleExposedConfigT } from '@ig/games-wordle-models';

export type WordleConfigT = WordleExposedConfigT & {
  solution: WordleSolutionT,
}

export type WordleSolutionT = {
  word: string,
}
