

import { type PublicWordleConfigT } from '@ig/games-wordle-models';

export type WordleConfigT = PublicWordleConfigT & {
  solution: WordleSolutionT,
}

export type WordleSolutionT = {
  word: string,
}
