
import type { WordleExposedConfigT, WordleStateT } from '@ig/games-wordle-models';

export type GameStateT = {
  gameStatus: GameStatusT,
  startTimeTs?: number,
  lastGivenExtraTimeTs?: number,
  finishTimeTs?: number,
  levelStates: LevelStateT[],
}

export type GameStatusT = 'notStarted' | 'inProcess' | 'ended';

// level

export type LevelStateT = {
  levelStatus: LevelStatusT,
  startTimeTs?: number,
  solvedTimeTs?: number,
} & ({
  kind: 'wordle',
  wordleExposedConfig: WordleExposedConfigT,
  wordleState: WordleStateT,
})

export type LevelStatusT = 'notStarted' | 'levelInProcess' | 'solved' | 'failed';
