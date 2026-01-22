
import type { AppDispatch } from "@ig/engine-app-ui";
import type { UserConfigeWebSocketMsgKindT } from "@ig/engine-models";
import { gamesUserConfigRtkApiUtil } from "../../model/rtk/GamesUserConfigRtkApi";

export const handleGamesUserConfigWebSocketMessage = (
  msgKind: UserConfigeWebSocketMsgKindT,
  dispatch: AppDispatch,
): void => {
  if (msgKind === 'gamesUserConfigUpdate') {
    dispatch(
      gamesUserConfigRtkApiUtil.invalidateTags(['GamesUserConfigTag'])
    );
  } else {
    throw new Error("Invalid message type");
  }
}
