
import type { AppDispatch } from "@ig/engine-app-ui";
import type { GamesInstanceUpdateWebSocketMsgKindT, GamesInstanceWebSocketMessagePayloadT } from '@ig/games-models';
import { gameInstanceRtkApiUtil } from "../../model/rtk/GameInstanceRtkApi";

export const handleGamesInstanceWebSocketMessage = (
  msgKind: GamesInstanceUpdateWebSocketMsgKindT,
  payload: GamesInstanceWebSocketMessagePayloadT,
  dispatch: AppDispatch,
): void => {
  if (msgKind === "gamesInstanceUpdate") {
    dispatch(
      gameInstanceRtkApiUtil.invalidateTags([{ type: 'GamesInstanceTag', id: payload.gameInstanceId }])
    );
  } else {
    throw new Error("Invalid message type");
  }
}
