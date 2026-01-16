
import type { AppDispatch } from "../../../../app/model/reducers/AppReduxStore";
import type { UserConfigeWbSocketMsgKindT } from "../../../../types/ApiRequestTypes";
import { userConfigRtkApiUtil } from "../../model/rtk/UserConfigRtkApi";

export const handleUserConfigWebSocketMessage = (
  msgKind: UserConfigeWbSocketMsgKindT,
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
