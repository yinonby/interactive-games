
// game

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
}

export type LevelStatusT = 'notStarted' | 'notSolved' | 'solved';
