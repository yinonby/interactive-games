
import { type GameConfigIdT, type GameConfigT, type GameStateT, type UserIdT } from "@ig/engine-models";
import type { SolutionConfigT } from "./SolutionTypes";

export type GameInstanceT = {
  gameConfigId: GameConfigIdT,
  playerUserIds: UserIdT[],
  gameState: GameStateT,
}

export type FullGameConfigT = GameConfigT & {
  solutionConfigs: SolutionConfigT[],
}
