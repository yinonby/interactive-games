
import { createSlice } from '@reduxjs/toolkit';
import type { GameUiConfigT } from '../../../types/GameUiConfigTypes';

/**
 * Slice state
 */
export interface GameUiConfigReducerStateT {
  gameUiConfig: GameUiConfigT | null;
}

/**
 * Initial state
 */
const initialState: GameUiConfigReducerStateT = {
  gameUiConfig: null,
};

/**
 * Game UI Config slice
 */
const gameUiConfigSlice = createSlice({
  name: 'gameUiConfigReducer',
  initialState,
  reducers: {},
});

/**
 * Reducer
 */
export const { reducerPath: gameUiConfigReducerPath } = gameUiConfigSlice;
export const { reducer: gameUiConfigReducer } = gameUiConfigSlice;
export type GameUiConfigPartialReducerStateT = { [gameUiConfigReducerPath]: GameUiConfigReducerStateT };

