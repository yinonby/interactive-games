
import type { WebsocketAdapter } from '@ig/client-utils';
import React, { createContext, useContext, useEffect, useRef, useState, type PropsWithChildren } from 'react';
import {
  type RnuiImageSourceT
} from '../../../../../ig-lib/ig-client-lib/ig-rnui';
import type { AppImageAssetT } from '../../../../ig-app-engine-models';
import type { GameUiConfigT, GamesUiUrlPathsAdapter } from '../../types/GameUiConfigTypes';
import type { WebsocketTopicSubscriptionProvider } from '../../types/WebsocketServerTypes';
import { useWsClient } from '../providers/useWsClient';

export interface AppConfigContextT {
  imagesSourceMap: Record<AppImageAssetT, RnuiImageSourceT>,
  gameUiConfig: GameUiConfigT,
  gamesUiUrlPathsAdapter: GamesUiUrlPathsAdapter,
  wsClient: WebsocketAdapter,
}

type AppConfigProviderPropsT = {
  imagesSourceMap: Record<AppImageAssetT, RnuiImageSourceT>,
  gameUiConfig: GameUiConfigT,
  gamesUiUrlPathsAdapter: GamesUiUrlPathsAdapter,
};

const AppConfig = createContext<AppConfigContextT | undefined>(undefined);

export const AppConfigProvider: React.FC<PropsWithChildren<AppConfigProviderPropsT>> = (props) => {
  const { imagesSourceMap, gameUiConfig, gamesUiUrlPathsAdapter, children } = props;
  const wsClientRef = useRef<WebsocketAdapter>(useWsClient(gameUiConfig.wssUrl, gameUiConfig.isDevel));
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    wsClientRef.current.connect();
    setIsInitialized(true);

    return () => {
      wsClientRef.current.disconnect();
    };
  }, []);

  const value: AppConfigContextT = {
    imagesSourceMap,
    gameUiConfig,
    gamesUiUrlPathsAdapter,
    wsClient: wsClientRef.current,
  }

  if (!isInitialized) {
    return null;
  }

  return (
    <AppConfig.Provider value={value}>
      {children}
    </AppConfig.Provider>
  );
};

export const useAppConfig = (): AppConfigContextT => useContext(AppConfig) as AppConfigContextT;

export const useAppWsClient = (): { wsClient: WebsocketAdapter } => {
  const { wsClient } = useAppConfig();

  return { wsClient };
}

export type WebsocketServerSubscribeMsgT = { action: 'subscribe', topic: string };
export type WebsocketServerUnsubscribeMsgT = { action: 'unsubscribe', topic: string };

export const useWebsocketTopicSubscriptionProvider = (): WebsocketTopicSubscriptionProvider => {
  const { wsClient } = useAppConfig();

  return {
    topicSubscribe: async (topic: string) => wsClient.send({ action: 'subscribe', topic: topic }),
    topicUnsubscribe: async (topic: string) => wsClient.send({ action: 'unsubscribe', topic: topic }),
  }
}
