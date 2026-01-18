
import type {
  MinimalGameInstanceExposedInfoT
} from "../game/GameTypes";
import type { UserIdT } from "../game/UserTypes";

export type UserConfigT = {
  userId: UserIdT,
  username: string,
  minimalGameInstanceExposedInfos: MinimalGameInstanceExposedInfoT[],
}
