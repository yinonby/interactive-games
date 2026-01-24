
import { configureStore } from '@reduxjs/toolkit';
import type { GameUiConfigT } from "../../../types/GameUiConfigTypes";
import { useClientLogger } from '../../providers/useClientLogger';
import { appRtkApiMiddleware, appRtkApiReducer, appRtkApiReducerPath } from "../rtk/AppRtkApi";
import { appRtkHttpAdapterGenerator } from './AppReduxUtils';
import {
    gameUiConfigReducer,
    gameUiConfigReducerPath
} from "./GameUiConfigReducer";

export const createReduxStore = (gameUiConfig: GameUiConfigT) => configureStore({
  reducer: {
    [gameUiConfigReducerPath]: gameUiConfigReducer,
    //[dataSrcVersionReducerPath]: dataSrcVersionReducer,
    [appRtkApiReducerPath]: appRtkApiReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: {
          appRtkHttpAdapterGeneratorProvider: appRtkHttpAdapterGenerator,
          logger: useClientLogger(),
        },
      },
    }).concat(appRtkApiMiddleware),
  preloadedState: {
    [gameUiConfigReducerPath]: {
      gameUiConfig: gameUiConfig,
    },
  }
});

export type AppStore = ReturnType<typeof createReduxStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
