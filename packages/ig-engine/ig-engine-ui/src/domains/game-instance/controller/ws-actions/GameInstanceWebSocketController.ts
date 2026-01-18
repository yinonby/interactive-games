
import type { GameInstanceUpdateWebSocketMsgKindT, GameInstanceWebSocketMessagePayloadT } from "@ig/engine-models";
import type { AppDispatch } from "../../../../app/model/reducers/AppReduxStore";
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
