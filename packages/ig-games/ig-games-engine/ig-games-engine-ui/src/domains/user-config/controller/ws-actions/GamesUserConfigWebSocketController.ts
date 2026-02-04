
import type { AppDispatch } from '@ig/app-engine-ui';
import type { GamesUserConfigeWebSocketMsgKindT } from '@ig/games-engine-models';
import { gamesUserConfigRtkApiUtil } from '../../model/rtk/GamesUserConfigRtkApi';

export const handleGamesUserConfigWebSocketMessage = (
  msgKind: GamesUserConfigeWebSocketMsgKindT,
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
