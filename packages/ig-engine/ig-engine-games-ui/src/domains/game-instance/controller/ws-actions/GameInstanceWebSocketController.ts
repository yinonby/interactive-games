
import type { AppDispatch } from "@ig/engine-app-ui";
import type { GameInstanceUpdateWebSocketMsgKindT, GameInstanceWebSocketMessagePayloadT } from "@ig/engine-models";
import { gameInstanceRtkApiUtil } from "../../model/rtk/GameInstanceRtkApi";

export const handleGameInstanceWebSocketMessage = (
  msgKind: GameInstanceUpdateWebSocketMsgKindT,
  payload: GameInstanceWebSocketMessagePayloadT,
  dispatch: AppDispatch,
): void => {
  if (msgKind === "gamesGameInstanceUpdate") {
    dispatch(
      gameInstanceRtkApiUtil.invalidateTags([{ type: 'GamesInstanceTag', id: payload.gameInstanceId }])
    );
  } else {
    throw new Error("Invalid message type");
  }
}
