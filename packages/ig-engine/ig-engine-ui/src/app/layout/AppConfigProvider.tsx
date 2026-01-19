
import {
  type RnuiImageSourceT
} from "@ig/rnui";
import React, { createContext, useContext, type PropsWithChildren } from 'react';
import type { GameImageTypeT } from "../../types/GameImageTypes";
import type { GameUiConfigT, GamesUiUrlPathsAdapter } from "../../types/GameUiConfigTypes";

export interface AppConfigT {
  imagesSourceMap: Record<GameImageTypeT, RnuiImageSourceT>,
  gameUiConfig: GameUiConfigT,
  gamesUiUrlPathsAdapter: GamesUiUrlPathsAdapter,
}

type AppConfigProviderPropsT = {
  imagesSourceMap: Record<GameImageTypeT, RnuiImageSourceT>,
  gameUiConfig: GameUiConfigT,
  gamesUiUrlPathsAdapter: GamesUiUrlPathsAdapter,
};

const AppConfig = createContext<AppConfigT | undefined>(undefined);

const AppConfigProvider: React.FC<PropsWithChildren<AppConfigProviderPropsT>> = (props) => {
  const { imagesSourceMap, gameUiConfig, gamesUiUrlPathsAdapter, children } = props;

  const value: AppConfigT = {
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

export default AppConfigProvider;
export const useAppConfig = (): AppConfigT => useContext(AppConfig) as AppConfigT;
