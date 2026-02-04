
import React, { createContext, useContext, type PropsWithChildren } from 'react';
import {
  type RnuiImageSourceT
} from '../../../../../ig-lib/ig-client-lib/ig-rnui';
import type { AppImageAssetT } from '../../../../ig-app-engine-models';
import type { GameUiConfigT, GamesUiUrlPathsAdapter } from '../../types/GameUiConfigTypes';

export interface AppConfigContextT {
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

  const value: AppConfigContextT = {
    imagesSourceMap,
    gameUiConfig,
    gamesUiUrlPathsAdapter,
  }

  return (
    <AppConfig.Provider value={value}>
      {children}
    </AppConfig.Provider>
  );
};

export const useAppConfig = (): AppConfigContextT => useContext(AppConfig) as AppConfigContextT;
