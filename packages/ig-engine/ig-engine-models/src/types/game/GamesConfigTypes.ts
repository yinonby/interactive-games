
import { type MinimalGameConfigT, type MinimalGameInstanceExposedInfoT } from "./GameTypes";

export type GamesConfigT = {
  availableMinimalGameConfigs: MinimalGameConfigT[],
}

export type GamesUserConfigT = {
  minimalGameInstanceExposedInfos: MinimalGameInstanceExposedInfoT[]
}
