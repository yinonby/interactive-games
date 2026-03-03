
import type { BaseQueryApi } from '@reduxjs/toolkit/query';
import { Axios, type HttpAdapter } from '../../../../../../ig-lib/ig-client-lib/ig-client-utils';
import type { AppRtkHttpAdapterGeneratorProvider } from '../../../types/AppRtkTypes';
import type { GameUiConfigT } from '../../../types/GameUiConfigTypes';
import {
  gameUiConfigReducerPath, type GameUiConfigPartialReducerStateT
} from './GameUiConfigReducer';

export const appRtkHttpAdapterGenerator: AppRtkHttpAdapterGeneratorProvider = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  generateHttpAdapter: (api: BaseQueryApi, url?: string): HttpAdapter | null => {
    const state: GameUiConfigPartialReducerStateT = api.getState() as unknown as GameUiConfigPartialReducerStateT;
    const gameUiConfig: GameUiConfigT | null = state[gameUiConfigReducerPath].gameUiConfig;

    if (gameUiConfig === null) {
      return null;
    }

    return new Axios(gameUiConfig.apiUrl);
  },
};
