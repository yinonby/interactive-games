
import type { MinimalGameInstanceExposedInfoT } from "../types/game/GameTypes";

export class MinimalGameInstanceExposedInfoDao {
  constructor(private readonly config: MinimalGameInstanceExposedInfoT) {}

  public getConfig(): MinimalGameInstanceExposedInfoT {
    return this.config;
  }

  public compare = (otherMgiiDao: MinimalGameInstanceExposedInfoDao): number => {
    const otherMgii: MinimalGameInstanceExposedInfoT = otherMgiiDao.getConfig();

    if (this.config.gameStatus !== otherMgii.gameStatus) {
      if (this.config.gameStatus === "in-process") {
        return -1;
      } else if (this.config.gameStatus === "not-started") {
        return otherMgii.gameStatus === "in-process" ? 1 : -1;
      } else {
        return 1
      }
    } else if (this.config.playerRole !== otherMgii.playerRole) {
      return this.config.playerRole === "admin" ? -1 : 1;
    } else {
      return this.config.minimalGameConfig.gameName.localeCompare(otherMgii.minimalGameConfig.gameName);
    }
  }
}
