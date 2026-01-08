
import type { AppDispatch } from "../../../../app/model/reducers/AppReduxStore";
import type { GameInstanceUpdateWebSocketMsgKindT, GameInstanceWebSocketMessagePayloadT } from "../../../../types/ApiRequestTypes";
import { gameInstanceRtkApiUtil } from "../../model/rtk/GameInstanceRtkApi";

export const handleGameInstanceWebSocketMessage = (
  msgKind: GameInstanceUpdateWebSocketMsgKindT,
  payload: GameInstanceWebSocketMessagePayloadT,
  dispatch: AppDispatch,
): void => {
  if (msgKind === "game-instance-update") {
    dispatch(
      gameInstanceRtkApiUtil.invalidateTags([{ type: 'GameInstanceTag', id: payload.gameInstanceId }])
    );
  } else {
    throw new Error("Invalid message type");
  }
}
