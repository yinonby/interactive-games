
import { configureStore } from '@reduxjs/toolkit';
import type { GameUiConfigT } from '../../../types/GameUiConfigTypes';
import { appRtkApiMiddleware, appRtkApiReducer, appRtkApiReducerPath } from '../rtk/AppRtkApi';
import './AppReduxStore';
import { createReduxStore } from './AppReduxStore';
import { gameUiConfigReducer, gameUiConfigReducerPath } from './GameUiConfigReducer';

// mocks

jest.mock('@reduxjs/toolkit', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  configureStore: jest.fn(({ reducer, middleware }: any) => {
    return {
      getState: jest.fn(),
      dispatch: jest.fn(),
      subscribe: jest.fn(),
      replaceReducer: jest.fn(),
      reducer,
      middleware,
    };
  }),
}));

jest.mock('../rtk/AppRtkApi', () => ({
  appRtkApi: {
    reducerPath: 'appRtkApi',
    reducer: jest.fn(),
    middleware: jest.fn(),
  },
}));

jest.mock('./GameUiConfigReducer', () => ({
  gameUiConfigReducer: jest.fn(),
  gameUiConfigReducerPath: 'gameUiConfigReducer',
}));

// tests

describe('AppReduxStore', () => {
  it('calls configureStore with correct reducers and middleware', () => {
    const reduxStore = createReduxStore({} as GameUiConfigT);

    expect(reduxStore).not.toBeNull();
    expect(configureStore).toHaveBeenCalledTimes(1);

    const callArg = (configureStore as jest.Mock).mock.calls[0][0];

    // Check reducers
    expect(callArg.reducer).toMatchObject({
      [gameUiConfigReducerPath]: gameUiConfigReducer,
      [appRtkApiReducerPath]: appRtkApiReducer,
      //[dataSrcVersionReducerPath]: dataSrcVersionReducer,
    });

    // Check middleware includes appRtkApiMiddleware
    const defaultMiddlewareResult = { concat: jest.fn().mockReturnValue('middlewareResult') };
    const middlewareFn = callArg.middleware;
    const middlewareResult = middlewareFn(() => defaultMiddlewareResult);

    expect(defaultMiddlewareResult.concat).toHaveBeenCalledWith(appRtkApiMiddleware);
    expect(middlewareResult).toBe('middlewareResult');
  });
});
