
import { type GameConfigT, type MinimalGameConfigT } from './GameTypes';

export type GamesConfigT = {
  availableMinimalGameConfigs: MinimalGameConfigT[],
}

export type GamesUserConfigT = {
  joinedGameConfigs: GameConfigT[],
}
