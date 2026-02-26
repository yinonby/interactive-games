
import type { PublicWordleConfigT, PublicWordleStateT } from '@ig/games-wordle-models';
import type { PublicCodePuzzleConfigT } from './LevelTypes';

export type GameStateT = {
  gameStatus: GameStatusT,
  startTimeTs?: number,
  lastGivenExtraTimeTs?: number,
  finishTimeTs?: number,
  levelStates: LevelStateT[],
}

export type GameStatusT = 'notStarted' | 'inProcess' | 'ended';

// level state holds a copy of the level config, in order to simplify

export type LevelStatusT = 'notStarted' | 'levelInProcess' | 'solved' | 'failed';

export type LevelStateT = {
  levelStatus: LevelStatusT,
  startTimeTs?: number,
  solvedTimeTs?: number,
} & ({
  kind: 'code',
  publicCodePuzzleConfig: PublicCodePuzzleConfigT,
  codeSolution: string,
} | {
  kind: 'wordle',
  publicWordleConfig: PublicWordleConfigT,
  publicWordleState: PublicWordleStateT,
  wordleSolution: string,
});
