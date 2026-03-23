
import type { AppDispatch } from '@ig/app-engine-ui';
import type { WebsocketMessagePayloadT } from '@ig/client-utils';
import { gameInstanceRtkApiUtil } from '../../model/rtk/GameInstanceRtkApi';

export type GameInstanceWebsocketUpdatesConfigT = {
  gameInstanceUpdateNotificationName: string,
  gameInstanceIdFieldName: string,
}

export const createGameInstanceUpdatesWebsocketMessageHandler = (config: GameInstanceWebsocketUpdatesConfigT) => (
  msgKind: string,
  payload: WebsocketMessagePayloadT | undefined,
  dispatch: AppDispatch,
): void => {
  if (payload === undefined) {
    return;
  }

  if (msgKind === config.gameInstanceUpdateNotificationName) {
    dispatch(
      gameInstanceRtkApiUtil.invalidateTags([{
        type: 'GameInstanceTag',
        id: payload[config.gameInstanceIdFieldName] as string,
      }])
    );
  } else {
    return;
  }
}
