
import type { UserConfigeWebSocketMsgKindT } from "@ig/engine-models";
import type { AppDispatch } from "../../../../app/model/reducers/AppReduxStore";
import { userConfigRtkApiUtil } from "../../model/rtk/UserConfigRtkApi";

export const handleUserConfigWebSocketMessage = (
  msgKind: UserConfigeWebSocketMsgKindT,
  dispatch: AppDispatch,
): void => {
  if (msgKind === 'user-config-update') {
    dispatch(
      userConfigRtkApiUtil.invalidateTags(['UserConfigTag'])
    );
  } else {
    throw new Error("Invalid message type");
  }
}
