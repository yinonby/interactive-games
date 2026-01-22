
import type { AppImageAssetT, UserIdT } from '@ig/engine-models';
import { generateUuidv4 } from '@ig/lib';
import {
  RnuiActivityIndicator,
  type RnuiImageSourceT
} from "@ig/rnui";
import React, { createContext, useContext, useEffect, useState, type PropsWithChildren } from 'react';
import type { GameUiConfigT, GamesUiUrlPathsAdapter } from "../../types/GameUiConfigTypes";
import { useClientLogger } from '../providers/useClientLogger';
import { getLocalUserId, setLocalUserId } from './AppConfigUtils';

export interface AppConfigContextT {
  curUserId: UserIdT,
  imagesSourceMap: Record<AppImageAssetT, RnuiImageSourceT>,
  gameUiConfig: GameUiConfigT,
  gamesUiUrlPathsAdapter: GamesUiUrlPathsAdapter,
}

type AppConfigProviderPropsT = {
  imagesSourceMap: Record<AppImageAssetT, RnuiImageSourceT>,
  gameUiConfig: GameUiConfigT,
  gamesUiUrlPathsAdapter: GamesUiUrlPathsAdapter,
};

const AppConfig = createContext<AppConfigContextT | undefined>(undefined);

export const AppConfigProvider: React.FC<PropsWithChildren<AppConfigProviderPropsT>> = (props) => {
  const { imagesSourceMap, gameUiConfig, gamesUiUrlPathsAdapter, children } = props;
  const [curUserId, setCurUserId] = useState("");
  const logger = useClientLogger();

  useEffect(() => {
    if (curUserId === "") {
      logger.info('Detecting curUserId...');
      const updateCurUserId = async () => {
        let _curUserId: string | null = await getLocalUserId();

        if (_curUserId === null) {
          logger.info('No curUserId found, generating new id');
          _curUserId = generateUuidv4();
          await setLocalUserId(_curUserId);
        } else {
          logger.info('Found curUserId');
        }

        setCurUserId(_curUserId);
      }

      updateCurUserId();
    }
  }, [curUserId]);

  const value: AppConfigContextT = {
    curUserId: curUserId,
    imagesSourceMap,
    gameUiConfig,
    gamesUiUrlPathsAdapter,
  }

  if (curUserId === '') return (
    <RnuiActivityIndicator testID='RnuiActivityIndicator-tid'/>
  );

  return (
    <AppConfig.Provider value={value}>
      {children}
    </AppConfig.Provider>
  );
};

export const useAppConfig = (): AppConfigContextT => useContext(AppConfig) as AppConfigContextT;
