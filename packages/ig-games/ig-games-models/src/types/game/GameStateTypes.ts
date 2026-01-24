
// game

export type GameStateT = {
  gameStatus: GameStatusT,
  startTimeTs?: number,
  lastGivenExtraTimeTs?: number,
  finishTimeTs?: number,
  levelStates: LevelStateT[],
}

export type GameStatusT = 'not-started' | 'in-process' | 'ended';

// level

export type LevelStateT = {
  levelStatus: LevelStatusT,
  startTimeTs?: number,
  solvedTimeTs?: number,
}

export type LevelStatusT = 'not-started' | 'not-solved' | 'solved';
