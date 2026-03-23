/* istanbul ignore file */

import { WebsocketAdapter, WebSocketClient } from '@ig/client-utils';
import type { LoggerAdapter } from '@ig/utils';
import { useClientLogger } from './useClientLogger';

export function useWsClient(
  wssUrl: string,
  isDevel: boolean
): WebsocketAdapter {
  const logger: LoggerAdapter = useClientLogger();
  if (isDevel) {
    logger.debug("Not creating mocked websocket client at the moment");
    //return new WebSocketClientMock(logger);
  }
  return new WebSocketClient(logger, wssUrl);
}
