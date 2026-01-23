
import { type GameConfigT, type MinimalGameConfigT, type MinimalGameInstanceExposedInfoT } from "./GameTypes";

export type GamesConfigT = {
  availableMinimalGameConfigs: MinimalGameConfigT[],
}

export type GamesUserConfigT = {
  joinedGameConfigs: GameConfigT[],
  minimalGameInstanceExposedInfos: MinimalGameInstanceExposedInfoT[]
}
