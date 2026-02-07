
import type { UserIdT } from '@ig/app-engine-models';
import type { GameConfigIdT, GameInfoT, GameStateT } from '@ig/games-engine-models';
import type { SolutionConfigT } from './SolutionTypes';

export type GameInstanceT = {
  gameConfigId: GameConfigIdT,
  playerUserIds: UserIdT[],
  gameState: GameStateT,
}

export type FullGameConfigT = GameInfoT & {
  solutionConfigs: SolutionConfigT[],
}
