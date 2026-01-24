
import type { MinimalGameInstanceExposedInfoT } from "../types/game/GameTypes";

export class MinimalGameInstanceExposedInfoDao {
  constructor(private readonly config: MinimalGameInstanceExposedInfoT) {}

  public getConfig(): MinimalGameInstanceExposedInfoT {
    return this.config;
  }

  public compare = (otherMgiiDao: MinimalGameInstanceExposedInfoDao): number => {
    const otherMgii: MinimalGameInstanceExposedInfoT = otherMgiiDao.getConfig();

    if (this.config.gameState.gameStatus !== otherMgii.gameState.gameStatus) {
      if (this.config.gameState.gameStatus === "in-process") {
        return -1;
      } else if (this.config.gameState.gameStatus === "not-started") {
        return otherMgii.gameState.gameStatus === "in-process" ? 1 : -1;
      } else {
        return 1
      }
    } else {
      return this.config.minimalGameConfig.gameName.localeCompare(otherMgii.minimalGameConfig.gameName);
    }
  }
}
