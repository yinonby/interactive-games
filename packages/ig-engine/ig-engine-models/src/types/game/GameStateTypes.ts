
// game

export type GameStateT = {
  gameStatus: GameStatusT,
  startTimeTs: number | null,
  finishTimeTs: number | null,
  levelStatuses: LevelStatusT[],
}

export type GameStatusT = "not-started" | "in-process" | "ended";

// level

export type LevelStateT = {
  levelStatus: LevelStatusT,
  startTimeTs: number | null,
  solvedTimeTs: number | null,
}

export type LevelStatusT = "not-solved" | "solved";
