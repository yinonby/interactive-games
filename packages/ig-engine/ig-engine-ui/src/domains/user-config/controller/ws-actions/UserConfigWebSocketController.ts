
import type { UserConfigeWebSocketMsgKindT } from "@ig/engine-models";
import type { AppDispatch } from "../../../../app/model/reducers/AppReduxStore";
import { userConfigRtkApiUtil } from "../../model/rtk/UserConfigRtkApi";

export const handleUserConfigWebSocketMessage = (
  msgKind: UserConfigeWebSocketMsgKindT,
  dispatch: AppDispatch,
): void => {
  if (msgKind === 'gamesUserConfigUpdate') {
    dispatch(
      userConfigRtkApiUtil.invalidateTags(['GamesUserConfigTag'])
    );
  } else {
    throw new Error("Invalid message type");
  }
}
