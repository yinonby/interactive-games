
import type { UserIdT } from '@ig/app-engine-models';
import type { GameConfigIdT, GameConfigT, GameStateT } from '@ig/games-engine-models';
import type { SolutionConfigT } from './SolutionTypes';

export type GameInstanceT = {
  gameConfigId: GameConfigIdT,
  playerUserIds: UserIdT[],
  gameState: GameStateT,
}

export type FullGameConfigT = GameConfigT & {
  solutionConfigs: SolutionConfigT[],
}
