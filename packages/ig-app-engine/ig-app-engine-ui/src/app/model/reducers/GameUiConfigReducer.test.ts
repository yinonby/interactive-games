
import type { GameUiConfigReducerStateT } from './GameUiConfigReducer';
import {
  gameUiConfigReducer,
  gameUiConfigReducerPath,
} from './GameUiConfigReducer';

describe('gameUiConfigReducer', () => {
  it('should have the correct reducerPath', () => {
    expect(gameUiConfigReducerPath).toBe('gameUiConfigReducer');
  });

  it('should return the initial state when called with undefined state', () => {
    const state = gameUiConfigReducer(undefined, { type: 'unknown' });

    const expectedState: GameUiConfigReducerStateT = {
      gameUiConfig: null,
    };

    expect(state).toEqual(expectedState);
  });

  it('should return the same state for unknown actions', () => {
    const prevState: GameUiConfigReducerStateT = {
      gameUiConfig: null,
    };

    const state = gameUiConfigReducer(prevState, { type: 'UNKNOWN_ACTION' });

    expect(state).toBe(prevState);
  });
});
