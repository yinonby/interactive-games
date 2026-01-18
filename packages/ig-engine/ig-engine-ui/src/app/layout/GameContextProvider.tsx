
import {
  type RnuiImageSourceT
} from "@ig/rnui";
import React, { createContext, useContext, type PropsWithChildren } from 'react';
import type { GameImageTypeT } from "../../types/GameImageTypes";
import type { GameUiConfigT, GameUiUrlPathsAdapter } from "../../types/GameUiConfigTypes";

export interface GameContextT {
  imagesSourceMap: Record<GameImageTypeT, RnuiImageSourceT>,
  gameUiConfig: GameUiConfigT,
  gameUiUrlPathsAdapter: GameUiUrlPathsAdapter,
}

type GameContextProviderPropsT = {
  imagesSourceMap: Record<GameImageTypeT, RnuiImageSourceT>,
  gameUiConfig: GameUiConfigT,
  gameUiUrlPathsAdapter: GameUiUrlPathsAdapter,
};

const GameContext = createContext<GameContextT | undefined>(undefined);

const GameContextProvider: React.FC<PropsWithChildren<GameContextProviderPropsT>> = (props) => {
  const { imagesSourceMap, gameUiConfig, gameUiUrlPathsAdapter, children } = props;

  const value: GameContextT = {
    imagesSourceMap,
    gameUiConfig,
    gameUiUrlPathsAdapter,
  }

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};

export default GameContextProvider;
export const useGameContext = (): GameContextT => useContext(GameContext) as GameContextT;
