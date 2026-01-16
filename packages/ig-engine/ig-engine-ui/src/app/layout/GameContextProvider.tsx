
import type { RnuiImageSourceT } from "@ig/rnui";
import React, { createContext, ReactElement, useContext } from 'react';
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
  children: ReactElement | ReactElement[],
};

const GameContext = createContext<GameContextT | undefined>(undefined);

const GameContextProvider: React.FC<GameContextProviderPropsT> = ({
  imagesSourceMap, gameUiConfig, gameUiUrlPathsAdapter, children }
) => {
  return (
    <GameContext.Provider value={{ imagesSourceMap, gameUiConfig, gameUiUrlPathsAdapter }}>
      {children}
    </GameContext.Provider>
  );
};

export default GameContextProvider;
export const useGameContext = (): GameContextT => useContext(GameContext) as GameContextT;
