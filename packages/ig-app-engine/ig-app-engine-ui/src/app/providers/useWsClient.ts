/* istanbul ignore file */

import type { LoggerAdapter } from '@ig/utils';
import { WebSocketClient, type WebSocketAdapter } from '../../../../../ig-lib/ig-client-lib/ig-client-utils';
import type { AppWebSocketMessagePayloadT, AppWebSocketRcvMsgKindT } from '../../types/AppWebSocketMsgTypes';
import { useClientLogger } from './useClientLogger';

export function useWsClient(
  wssUrl: string,
  isDevel: boolean
): WebSocketAdapter<AppWebSocketRcvMsgKindT, never, AppWebSocketMessagePayloadT> {
  const logger: LoggerAdapter = useClientLogger();
  if (isDevel) {
    logger.debug("Not creating mocked websocket client at the moment");
    //return new WebSocketClientMock(logger);
  }
  return new WebSocketClient<AppWebSocketRcvMsgKindT, never, AppWebSocketMessagePayloadT>(logger, wssUrl);
}
