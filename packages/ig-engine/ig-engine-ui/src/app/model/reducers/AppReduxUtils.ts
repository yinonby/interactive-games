
import { Axios, type HttpAdapter } from '@ig/client-utils';
import type { BaseQueryApi } from '@reduxjs/toolkit/query';
import { ApiServerMock } from '../../../../test/mocks/ApiServerMock';
import type { AppRtkHttpAdapterGeneratorProvider } from '../../../types/AppRtkTypes';
import type { GameUiConfigT } from "../../../types/GameUiConfigTypes";
import {
  gameUiConfigReducerPath, type GameUiConfigPartialReducerStateT
} from "./GameUiConfigReducer";

export const appRtkHttpAdapterGenerator: AppRtkHttpAdapterGeneratorProvider = {
  generateHttpAdapter: (api: BaseQueryApi): HttpAdapter | null => {
    const state: GameUiConfigPartialReducerStateT = api.getState() as unknown as GameUiConfigPartialReducerStateT;
    const gameUiConfig: GameUiConfigT | null = state[gameUiConfigReducerPath].gameUiConfig;

    if (gameUiConfig === null) {
      return null;
    }

    if (gameUiConfig.isDevel) {
      return new ApiServerMock(gameUiConfig.apiUrl);
    }
    return new Axios(gameUiConfig.apiUrl);
  },
};
