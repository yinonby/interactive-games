

import { type PublicWordleConfigT } from '@ig/games-wordle-models';

export interface WordleAdapter {
  generateWordleSolution(publicWordleConfig: PublicWordleConfigT): string;
}
